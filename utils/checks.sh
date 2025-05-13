#!/usr/bin/env bash

# Source colors
source "$(dirname "$0")/colors.sh"

# Check if running in Termux
check_termux() {
    if [ ! -d "/data/data/com.termux" ]; then
        print_error "This script must be run in Termux"
        exit 1
    fi
}

# Check internet connection
check_internet() {
    if ! ping -c 1 google.com >/dev/null 2>&1; then
        print_error "No internet connection"
        exit 1
    fi
}

# Check available storage
check_storage() {
    local required_space=4000000 # 4GB in KB
    local available_space=$(df . | awk 'NR==2 {print $4}')
    
    if [ "$available_space" -lt "$required_space" ]; then
        print_error "Not enough storage space. Need at least 4GB free."
        exit 1
    fi
}

# Check CPU architecture
check_arch() {
    local arch=$(uname -m)
    case $arch in
        aarch64|arm64)
            print_success "Architecture $arch is supported"
            ;;
        *)
            print_error "Architecture $arch is not supported"
            exit 1
            ;;
    esac
}