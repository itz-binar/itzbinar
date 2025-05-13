#!/usr/bin/env bash

# Itzbinar Installer
# This script downloads and sets up the Itzbinar project
# Version: 1.1.0

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Print colored messages
print_info() {
    echo -e "${BLUE}[*] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[✓] $1${NC}"
}

print_error() {
    echo -e "${RED}[✗] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

# Progress bar
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((width * current / total))
    local remaining=$((width - completed))
    
    printf "\rProgress: [%${completed}s%${remaining}s] %d%%" "" "" "$percentage"
}

# Check system requirements
check_requirements() {
    print_info "Checking system requirements..."
    
    # Check if running in Termux
    if [ ! -d "/data/data/com.termux" ]; then
        print_error "This script must be run in Termux"
        exit 1
    fi
    
    # Check Android version
    local android_version=$(getprop ro.build.version.release)
    if [ "${android_version%%.*}" -lt 7 ]; then
        print_error "Android 7.0 or higher is required"
        exit 1
    fi
    
    # Check available storage
    local available_storage=$(df -k . | awk 'NR==2 {print $4}')
    if [ "$available_storage" -lt 4000000 ]; then
        print_error "At least 4GB of free storage is required"
        exit 1
    fi
    
    print_success "System requirements met"
}

# Install required packages
install_packages() {
    print_info "Updating package repositories..."
    if ! pkg update -y &> /dev/null; then
        print_error "Failed to update package repositories"
        exit 1
    fi
    
    print_info "Upgrading installed packages..."
    if ! pkg upgrade -y &> /dev/null; then
        print_warning "Some packages could not be upgraded"
    fi
    
    print_info "Installing required packages..."
    local packages=(git wget curl proot)
    local total=${#packages[@]}
    local current=0
    
    for package in "${packages[@]}"; do
        current=$((current + 1))
        show_progress $current $total
        if ! pkg install -y "$package" &> /dev/null; then
            echo
            print_error "Failed to install $package"
            exit 1
        fi
    done
    echo
}

# Clone repository
clone_repository() {
    print_info "Downloading Itzbinar..."
    
    # Backup existing installation
    if [ -d ~/itzbinar ]; then
        print_warning "Existing installation found, creating backup..."
        mv ~/itzbinar ~/itzbinar.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    if ! git clone https://github.com/itzbinar/itzbinar.git ~/itzbinar; then
        print_error "Failed to download Itzbinar"
        exit 1
    fi
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    cd ~/itzbinar || exit 1
    chmod +x itzbinar.sh
    chmod +x utils/*.sh
    chmod +x systems/*/*.sh
    
    # Add to PATH
    echo 'export PATH="$PATH:$HOME/itzbinar"' >> ~/.bashrc
    
    # Create data directory
    mkdir -p ~/itzbinar/data
}

# Main installation process
main() {
    clear
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║         ITZBINAR INSTALLER          ║"
    echo "║          Version 1.1.0              ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_requirements
    install_packages
    clone_repository
    setup_environment
    
    print_success "Installation complete!"
    print_info "Run 'cd ~/itzbinar && ./itzbinar.sh' to start"
    
    # Offer to start immediately
    read -p "Would you like to start Itzbinar now? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        cd ~/itzbinar && ./itzbinar.sh
    fi
}

# Handle script interruption
trap 'echo -e "\n${RED}Installation interrupted.${NC}"; exit 1' INT TERM

# Start installation
main