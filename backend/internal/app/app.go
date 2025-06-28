package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ekastn/shemaps/backend/internal/config"
	"github.com/ekastn/shemaps/backend/internal/handlers"
	"github.com/ekastn/shemaps/backend/internal/services"
	"github.com/ekastn/shemaps/backend/internal/store"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type app struct {
	srv *http.Server
	cfg *config.Config
	db  *pgxpool.Pool
}

func New(cfg *config.Config) *app {
	return &app{
		cfg: cfg,
	}
}

func (a *app) Init() {
	conn, err := pgxpool.New(context.Background(), a.cfg.PostgresURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	err = conn.Ping(context.Background())
	if err != nil {
		log.Fatalf("Unable to ping database: %v\n", err)
	}

	a.db = conn

	queries := store.New(conn)

	mapsService, err := services.NewMapsService(a.cfg)
	if err != nil {
		log.Fatalf("Error creating maps service: %v", err)
	}

	reportService := services.NewReportService(queries)

	handler := handlers.NewHandlers(mapsService, *reportService, queries, a.cfg)

	mux := mount(handler)

	srv := &http.Server{
		Addr:         a.cfg.Addr,
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	a.srv = srv
}

func (a *app) Start() {
	a.Init()
	go func() {
		log.Printf("Server starting on %s\n", a.srv.Addr)
		if err := a.srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Println("Shutting down server...")
	if err := a.srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v\n", err)
	}

	a.db.Close()

	log.Println("Server stopped gracefully")
}

func mount(h *handlers.Handlers) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", h.Auth.Register)
			r.Post("/login", h.Auth.Login)
		})

		r.Get("/routes", h.Directions.GetDirections)

		r.Post("/reports", h.Report.CreateReport)
		// Protected routes
		// r.Group(func(r chi.Router) {
		// 	authMiddleware := custommiddleware.Authenticate(h.Auth.GetAuthService())
		// 	r.Use(authMiddleware)
		// 	r.Post("/reports", h.Report.CreateReport)
		// })
	})

	return r
}
