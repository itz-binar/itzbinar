#!/usr/bin/env bash

# Color definitions for consistent styling
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export BLUE='\033[0;34m'
export YELLOW='\033[1;33m'
export NC='\033[0m'

# Print colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "${color}${text}${NC}"
}

# Print success message
print_success() {
    print_color "$GREEN" "✓ $1"
}

# Print error message
print_error() {
    print_color "$RED" "✗ $1"
}

# Print info message
print_info() {
    print_color "$BLUE" "ℹ $1"
}

# Print warning message
print_warning() {
    print_color "$YELLOW" "⚠ $1"
}