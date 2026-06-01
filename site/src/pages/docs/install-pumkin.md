---
layout: ../../layouts/DocsLayout.astro
title: Install Pumkin
description: Run the installer, get past SmartScreen, and launch Pumkin for the first time.
---

After you buy Pumkin you get a download link by email (and on the confirmation page). It's a single Windows installer — no dependencies to chase, the runtime it needs is bundled in.

## 1. Download

Click the download link from your welcome email. You'll get a file named like:

```
Pumkin_0.0.1_x64-setup.exe
```

The link is tied to your purchase, so keep the email. If you ever lose the file, the same link re-downloads it — or email **hi@pumkin.app** with the address you bought with and I'll resend.

## 2. Run the installer

Double-click the `.exe`. Windows will install Pumkin and drop a shortcut in your Start menu and on your desktop.

### Getting past the SmartScreen warning

The first time you run it, Windows SmartScreen may show a blue **"Windows protected your PC"** dialog saying the publisher is unknown. This is expected — it appears for any app that isn't yet code-signed with a paid certificate, not a sign anything's wrong.

To proceed:

1. Click **More info**
2. Click **Run anyway**

> **Why the warning?** Code-signing certificates cost a few hundred dollars a year, and removing this prompt is on the roadmap funded by founding sales. Until then, the click-through is harmless. The installer you downloaded from your purchase link is the real thing.

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
