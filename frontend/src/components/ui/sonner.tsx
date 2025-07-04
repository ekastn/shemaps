import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            {...props}
            icons={{
                success: null,
                info: null,
                warning: null,
                error: null,
                loading: null,
            }}
        />
    );
};

export { Toaster };
