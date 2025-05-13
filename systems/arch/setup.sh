#!/usr/bin/env bash

# Source utility functions
source "../../utils/colors.sh"
source "../../utils/checks.sh"

# Install Arch Linux
install_arch() {
    print_info "Installing Arch Linux..."
    
    # Download and extract rootfs
    wget https://mirrors.kernel.org/archlinux/iso/latest/archlinux-bootstrap-x86_64.tar.gz
    
    # Create Arch directory
    mkdir -p ~/itzbinar/arch
    
    # Extract rootfs
    proot --link2symlink tar -xf archlinux-bootstrap-x86_64.tar.gz -C ~/itzbinar/arch
    
    # Setup start script
    create_start_script
    
    print_success "Arch Linux installed successfully!"
}

# Create start script
create_start_script() {
    cat > ~/itzbinar/startarch.sh << 'EOF'
#!/usr/bin/env bash
cd ~/itzbinar/arch
proot \
    --link2symlink \
    -0 \
    -r ~/itzbinar/arch \
    -b /dev \
    -b /proc \
    -b /sys \
    -b ~/itzbinar/arch/root:/dev/shm \
    -w /root \
    /usr/bin/env -i \
    HOME=/root \
    PATH=/usr/local/sbin:/usr/local/bin:/bin:/usr/bin:/sbin:/usr/sbin \
    TERM=$TERM \
    LANG=C.UTF-8 \
    /bin/bash --login
EOF
    
    chmod +x ~/itzbinar/startarch.sh
    
    # Add alias to .bashrc
    echo "alias startarch='~/itzbinar/startarch.sh'" >> ~/.bashrc
}