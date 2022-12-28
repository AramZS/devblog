---
title: Setting up a Raspberry Pi for Development - Day 1
description: "Getting together everything I need for a remote development environment."
date: 2022-12-23 22:59:43.10 -4
tags:
  - Node
  - Raspberry Pi
  - SSH
  - Linux
  - Development Tools
  - WiP
---

## Project Scope and ToDos

1. Be able to host a server
2. Be able to build node projects
3. Be able to handle larger projects

- [ ] Be able to run continually

## Day 1

I've had a Canakit Raspberry Pi 4 sitting around for a while and while trying to set up a site to host an archive of my Tweets [I've maxed out some some things on my MacBook](https://github.com/tweetback/tweetback/issues/10). This isn't great, but there seem to be solutions. However, those solutions require mucking about with some pretty core system settings that maybe I don't want to mess with on my main machine.

So, it makes sense to set this machine up to handle these projects. That means getting a dev environment running with Node capabilities. The package I got ships with [NOOBS](https://www.raspberrypi.com/news/introducing-noobs/) a tool for setting it up with [Raspbian](https://www.raspbian.org/) a Linux variant specialized for Pis. I slid that in, connected it to the internet via ethernet, and then let it do the install. First step was easy.

Next step is allowing me to control it remotely. I have a tiny keyboard and tiny monitor that helps me with my Pi setup, but it isn't really great to work on, so let's do some alternatives right?

I can go into the first menu and go to Raspberry Pi Configuration under preferences. From there I can turn on SSH and VNC connections. That's a good start!

Now that I've turned this on I can SSH in. But I'll need to know my local IP.

`hostname -I`

That gives me my the IP. Useful! I also want it to have a real hostname so I can more easily see it on the network.

`sudo hostnamectl set-hostname newhostname`
`sudo vi /etc/hosts`

Then I can replace the value that follows `127.0.1.1` (usually `raspberrypi`) with my new hostname `newhostname`.

Now from my normal machine I can SSH in.

`ssh username@192.168.1.xx`

I then accept the new key and enter my password and I'm in. I can see my new hostname.

Ok, I have a bluetooth dongle I might want to use later, so I'll make sure I've got that all configured.

With `lsusb` I can see all the USB items that are attached to the device.

I'll first update my packages.

`sudo apt-get update`

Then I'll make sure all the bluetooth tools are ready to go.

`sudo apt install bluetooth pi-bluetooth bluez blueman`

I'll make sure the default configuration is in place.

`sudo update-rc.d bluetooth defaults`

I'll double check and can see that the `git` command is working. So we've got that.

Next, from my home directory, I'll make a folder to put my projects into:

`mkdir Projects`

I want to pull my first big project in from my main machine. I could pull it on to a USB stick and copy it back and forth, but there is a faster option.

In a new console window, I'll set up that connection and use `-az` in order to make the copying of the files as efficient as possible.

`rsync -az ~/ProjectsFolder/tweetback username@192.168.1.xxx:~/ProjectsFolder/twitterwork/`

This will copy the folder on my local machine `tweetback` as a folder into `~/ProjectsFolder/twitterwork/` giving me my project at `~/ProjectsFolder/twitterwork/tweetback`. Ok, now to let it move over 5+ gigs. All done in around 20 minutes!

I might want to do some actual folder sharing later, so for that `sudo apt install samba -y`

I want to set up to use Node now. Easy way to do that? Let's use `nvm` which we can set up to manage our node versions for use in various projects:

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`

Now I can install node versions with `nvm` like `nvm install 14`

Now, let's make this a slightly better dev environment. We're going to install ZSH.

`sudo apt-get install zsh -y`

and now Oh My ZSH.

`sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`

Now let's install Powerline fonts.

`git clone https://github.com/powerline/fonts`
`cd fonts`
`./install.sh`

Now we can try out using the `agnoster` theme for ZSH, which is my fav.

Here's the bash configuration for NVM:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Hmm, adopting my version of NVM as a manager isn't quite working. It looks like there are some tools for managing ZSH plugins. Let's take a look.

Let's try [Zplug](https://github.com/zplug/zplug)?

Having [this issue](https://github.com/zplug/zplug/issues/535). Hmmm.

First I had to `chmod 775 /home/zs/.zplug`

Then I had to do `zplug 'tj/n', as:command, use:'bin/n'` from [here](https://github.com/zplug/zplug/issues/204#issuecomment-225431044).

Then [I set up `zsh-nvm`](https://github.com/lukechilds/zsh-nvm) using zplug - `https://github.com/lukechilds/zsh-nvm`.

Next I need to remove node_modules. I'll need to rebuild everything on the new Linux environment.

Ok, that's it for today, I'll take care of that tomorrow.
