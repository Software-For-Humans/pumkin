---
layout: ../../layouts/DocsLayout.astro
title: Install Pumkin
description: Run the installer, get past SmartScreen, and launch Pumkin for the first time.
---

Pumkin ships as a single Windows installer — no dependencies to chase, the runtime it needs is bundled in. It's free and open source; grab the latest build from GitHub Releases.

## 1. Download

Head to the [releases page](https://github.com/Software-For-Humans/pumkin/releases/latest) and download the latest installer. You'll get a file named like:

```
Pumkin_0.0.1_x64-setup.exe
```

Every release lists its installer under **Assets**. If a download fails partway, just grab it again.

## 2. Run the installer

Double-click the `.exe`. Windows will install Pumkin and drop a shortcut in your Start menu and on your desktop.

### Getting past the SmartScreen warning

The first time you run it, Windows SmartScreen may show a blue **"Windows protected your PC"** dialog saying the publisher is unknown. This is expected — it appears for any app that isn't yet code-signed with a paid certificate, not a sign anything's wrong.

To proceed:

1. Click **More info**
2. Click **Run anyway**

> **Why the warning?** Code-signing certificates cost a few hundred dollars a year, and removing this prompt is on the roadmap. Until then, the click-through is harmless. You can verify exactly what you're running — the full source is on GitHub.

## 3. First launch

Open Pumkin from the Start menu or desktop shortcut. On first launch it starts its local server and checks that it can reach Ollama.

Make sure **Ollama is running** before or shortly after you launch (on Windows it auto-starts, so it usually already is). If Pumkin can't find any models, it's almost always because Ollama isn't running or you haven't pulled a model yet — go back to [Install Ollama & models](/docs/installing-ollama/).

## Where Pumkin keeps its files

Pumkin installs and stores its data under your local app data folder:

```
%LOCALAPPDATA%\Pumkin\
```

That's where the app lives and where your local database (runs, messages, tool history) is kept. Logs live here too, which matters if you ever need to debug something — see [Troubleshooting](/docs/troubleshooting/).

You're installed. Next: [Your first agent →](/docs/first-agent/)
