#!/usr/bin/env bash

# Source utility functions
source "../../utils/colors.sh"
source "../../utils/checks.sh"

# Install Kali Linux
install_kali() {
    print_info "Installing Kali Linux..."
    
    # Download and extract rootfs
    wget https://kali.download/nethunter-images/current/rootfs/kalifs-arm64-minimal.tar.xz
    
    # Create Kali directory
    mkdir -p ~/itzbinar/kali
    
    # Extract rootfs
    proot --link2symlink tar -xf kalifs-arm64-minimal.tar.xz -C ~/itzbinar/kali
    
    # Setup start script
    create_start_script
    
    print_success "Kali Linux installed successfully!"
}

# Create start script
create_start_script() {
    cat > ~/itzbinar/startkali.sh << 'EOF'
#!/usr/bin/env bash
cd ~/itzbinar/kali
proot \
    --link2symlink \
    -0 \
    -r ~/itzbinar/kali \
    -b /dev \
    -b /proc \
    -b /sys \
    -b ~/itzbinar/kali/root:/dev/shm \
    -w /root \
    /usr/bin/env -i \
    HOME=/root \
    PATH=/usr/local/sbin:/usr/local/bin:/bin:/usr/bin:/sbin:/usr/sbin \
    TERM=$TERM \
    LANG=C.UTF-8 \
    /bin/bash --login
EOF
    
    chmod +x ~/itzbinar/startkali.sh
    
    # Add alias to .bashrc
    echo "alias startkali='~/itzbinar/startkali.sh'" >> ~/.bashrc
}