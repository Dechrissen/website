---
title: Linux PC Build 2021
date: 23 October 2021
number: 7
description: A brand new daily driver.
---
My current PC, a Windows machine that I use for gaming, programming, writing, and other general daily tasks, has served me well. I built it back in 2014, my first year of college. In my last blog entry, I listed its specs (peripherals included), which I will paste here again for convenience:

- CPU: Intel Core i5-4570 CPU @ 3.20GHz
- RAM: 8 GB DDR3
- GPU: NVIDIA GeForce GTX 760
- OS: Windows 10 Home 64-bit
- System drive: Samsung 860 EVO 500 GB SSD
- Storage drive: Seagate Barracuda 2 TB HDD
- Monitor: ASUS VX248H 1080p @ 60Hz
- Speakers: Edifier R1280T 2.0 42 Watt studio monitors
- Keyboard: Ducky One 2 with Cherry MX Red switches
- Mouse: Logitech G502 wired

For my purposes, I've been very happy with this machine, and I've been able to make some small upgrades throughout its life to enhance my experience, like extra USB 3.0 expansions, upgrading drives to solid state, getting new peripherals, etcetera. In fact, I also ordered another 8GB kit of DDR3 RAM to increase it to 16GB, finally. I don't know how I got by with 8GB for 7 years.

A few months ago, I tried dual booting Windows and Linux on this machine, and it ended up being a huge hassle. Turns out, the `grub` bootloader for Ubuntu ended up killing the Windows bootloader, and I wasn't able to get back into my Windows install, which obviously defeats the purpose of dual booting. So I told myself I'd never deal with the headache of dual booting again.

That's where the subject of this blog entry begins. I'd been wanting to build a new PC for a long time now, and my newly acquired income is what pushed me to finally do it (even though we're in the midst of a GPU shortage at the time of my writing this). I opted to exclude a GPU this time around, in favor of a Ryzen CPU with integrated Radeon graphics. The new build is not meant for gaming, and so I felt leaving out a graphics card was the best thing to do, with the added bonus of not needing to dish out triple the cost of the PC itself to buy one.

But then you might be thinking, "Derek, why are you building a new computer that can't handle gaming, if you consider yourself a gamer? Why not just keep your old one?" And that's a good question. Well... I am keeping my old one. That'll remain my gaming PC. It's true that this may seem like a waste of money being that I *really* don't need a new PC right now, but I *can* point to a few reasons why I might benefit from this new build.

1. After almost 10 years, doing a new build means I can reap the benefits of fancy new hardware, which I'll get into later.
2. After that failed attempt at dual booting, this will give me a chance to incorporate Linux into my daily life more easily, since my goal with this new build is to make it my daily driver.
3. Expandability. Being that the hardware is more up-to-date, it means that there's a higher likelihood that I can take advantage of any kind of new technology or hardware that comes out.
4. I will get more experience building PCs (this will be my 3rd time doing a build from scratch). I enjoy it!

Item number 2 is probably the most important for me right now. I've been very interested for a long time in switching over to a Linux distro as my main OS, which is why I tried dual booting in the first place. I've tried a few, and I'm fairly comfortable with terminal-based use of Linux (especially since I use it daily at work now), but I've never had the opportunity to use a Linux desktop for more than a few days at a time. I feel that having a PC that I use solely for Linux will be a nice way to force it upon myself. The idea is to use some sort of [KVM switch](https://en.wikipedia.org/wiki/KVM_switch) with both of my PCs, so that I can use all the same peripherals between both PCs, since I won't ever be using both at the same time.

### The build

So now let's get into the new build. I'll go piece by piece, starting with the most important, 
