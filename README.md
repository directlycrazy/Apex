# Apex, Your New Personal Assistant
2023 Hackathon for STEM Club

### How It Works
This project takes advantage of Cloudflare's new Workers AI, Meta LLaMA, OpenAI Whisper, and ElevenLabs.io.

When using the client, your voice will first be uploaded to the server, converted into an MP3 using ffmpeg, and transcribed into text using OpenAI Whisper.

After finding the raw text, it will then be run through LLaMA, to create a response to the query. This is where the PocketBase instance comes in, being used for storing message logs and chat history, for the AI to have conversation context.

Then, this response will be sent to ElevenLabs, in order to be processed as a natural sounding human voice to playback to the user.

### Requirements
For this project, you will need:
* A free Cloudflare account
* A free ElevenLabs.io account
* A computer or cloud server with NodeJS 16+ and ffmpeg installed
* A PocketBase instance, run locally, or hosted (ex. pockethost.io)

### Organization
This monorepo is organized into a two folders.

##### Client
This is the SvelteKit client used to access Apex.

##### Server
This is the server to be run on your personal computer, or a cloud server.

### Environment Variables

##### Server

Note that `ELEVENLABS_API` is optional, but it will restrict the ability for Apex to talk.

```env
ELEVENLABS_API=
CLOUDFLARE_ACCOUNT=
CLOUDFLARE_API=
PB_EMAIL=
PB_PASSWORD=
```

##### Client
This is the URL used to access your server.

Note that `VITE_INSPARE_MUSIC_KEY` is optional, but it will restrict music playback.

```env
VITE_API_URL=
VITE_INSPARE_MUSIC_KEY=
```