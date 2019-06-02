Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/bionic64"

  config.vm.define "worker" do |normal|

      config.vm.box = "ubuntu/bionic64"

      config.vm.synced_folder ".", "/vagrant",  :owner=> 'vagrant', :group=>'users', :mount_options => ['dmode=777', 'fmode=777']

      config.vm.provider "virtualbox" do |vb|
         # Display the VirtualBox GUI when booting the machine
         vb.gui = false

        # Customize the amount of memory on the VM:
        vb.memory = "1024"

      end

      config.vm.provision :shell, path: "vagrant/bootstrap.sh"

  end

end
