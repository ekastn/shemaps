FROM ubuntu:22.04

# Install Android SDK tools
ENV ANDROID_HOME="/opt/android-sdk"

RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    unzip \
    wget \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O /tmp/commandlinetools.zip && \
    unzip -q /tmp/commandlinetools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/commandlinetools.zip

# Set PATH for sdkmanager
ENV PATH="$PATH:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

# Accept licenses and install platforms/build-tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platforms;android-35" "build-tools;34.0.0" "platform-tools"

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update -q && apt-get install -qy nodejs
ENV NPM_CONFIG_PREFIX=/root/.npm-global
ENV PATH=$PATH:/root/.npm-global/bin
RUN npm i -g yarn

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm and then project dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the web app and then sync Capacitor Android
RUN npm run build
RUN npx cap sync android

# Build the Android app using Gradle
RUN cd android && ./gradlew assembleDebug

