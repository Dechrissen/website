---
title: Thoughts on Generative AI
date: 28 June 2026
number: 49
description: Working through my thoughts related to generative AI.
tags: thoughts, opinion, ai
finished: true
---

I recently read [an article](https://www.extratricky.com/md/ai.md) by Brian Hamrick (ExtraTricky) in which he laid out his stance on [generative AI](https://en.wikipedia.org/wiki/Generative_AI) and how it's typically being used and some of the implications of that usage. Before I saw the article, I'd also been planning on writing a blog post explaining my thoughts on the topic; this idea was inspired by some of my own AI usage recently, and how I see others using it.

This is going to be that blog post — except now having read ExtraTricky's article, I also want to comment a bit on some of his points along the way. It's a good article and I recommend that you read it. He's a smarter person than I am, and I typically like reading his blog because I'll inevitably learn something new, or at least learn of the existence of something I'd never heard of before. If you read his AI article, you'll quickly see that his stance is an extreme one. It starts with a list of all the ways in which he doesn't use LLMs for his projects. Taking a definitive black-or-white stance is something I appreciate in general, but I don't think I (currently) take quite the same stance as him.

That's the first point I want to make in this post: I don't really have a completely solidified or thought-through view on generative AI yet. I do have some opinions and thoughts, and a lot of them align with those in the article, but some don't — I'm not sure if that's because of true disagreement or because I haven't yet seen the light of the opposing views.

Btw, I just looked up and saw a couple of em dashes. I feel compelled to let you know (given the context of this post) that I actually typed those myself. :)

# An anecdote involving LLM usage

Over the past few months, I've been working on a project called [Dexelect](https://github.com/Dechrissen/dexelect) — a progression-aware Pokémon party generator tool. It generates a party of 6 Pokémon for the user to then use in-game, but crucially the parties it generates adhere to the logical progression of the game. The tool then assigns the party a "grade" which encodes the general feasibility of using that party (early game leaning, late game leaning, etc.).

The tool is separated into logic and data, and its bundled data comes in the form of YAML files which represent game data like Pokémon stats, location data, etc. Those YAML files are in a custom format I created for this project and as such, need to be created from scratch.

When I created some of the original test YAMLs in the early stages of this project, I wanted to get them built quickly so I could test the logic I'd written; so I ended up using a combination of various LLM-generated scripts which pulled and compiled the Pokémon data I needed from various sources.

That being said, I enjoy the process of building a project. I'm not a software engineer, so I don't know everything and I'm constantly researching methods and small questions online as I work (this is how I've done it for many years, before LLMs even existed). But writing the core logic was not something I personally wanted to use LLMs for. Actually, there was one algorithmic part of the code that I consulted an LLM for help on, but I was OK offloading that math (I'm not a mathematician either).

The tool started as a CLI-only application. As the project went on, I wanted to implement a GUI frontend as well, since I felt it would appeal to a wider audience if there was a GUI. I'd worked on UI design before (specifically CSS for this website and others), but never a desktop application.

Essentially, I made a decision: I didn't care to learn how to use the particular GUI library I chose (`customtkinter`). I was trying to maximize reach in using a GUI library that would be able to build binaries for any of the major platforms (Windows, Linux, macOS), so to me it felt like the GUI was more of a bridge to reaching users than a project component (though it obviously is one).

So this is the first time I attempted using an LLM as a "worker" — something that I could outsource a particular subtask of my project to. Natural language prompts are very convenient here. I wrote up an explanation of what I wanted in the GUI generally, gave it to Claude, and let it rip. It worked very well, though naturally I did need to make tweaks to get it closer to my vision.

But the important takeaway from this anecdote is that I made the decision that LLM usage is appropriate for certain tasks. Perhaps what defines these tasks varies depending on the person. To be clear, I'm not making the case that there _isn't_ a definitive "right" or "wrong" when it comes to LLM usage — because maybe there is. That is to say, maybe there are always downsides to utilizing LLMs and it's up to the user to determine what they are and weigh those downsides with any potential upsides. Context matters.

# The downsides of using LLMs for code

The reason I like working on projects is because I like building things, and software is cool because you can build a tool or app or game that is functional, and others can use it and provide feedback and it can be rewarding. But I'm not a software engineer — I don't know all the ins and outs of software development, so when I have an idea, I start with what I know I _can_ do, and then look things up and figure out how to do the rest as I go. The "figuring it out" is part of the project itself.

So when LLMs came along, and particularly when they got better at writing code, the concept of [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) came about. Essentially, vibe coding is "writing code" but in the form of natural language, which an LLM then interprets and translates into actual code. While I'm not defending the concept of vibe coding necessarily, I don't like the phrase because of how it's used reactively or dismissively, e.g. "I won't use that software if AI came anywhere near the code base." or "This app sucks, I bet the dev just vibe coded it in a weekend."

But, depending on the type of project, I do think it is reasonable to be skeptical of software which was "vibe coded". The general sentiment is that the developers should have a solid understanding of the code they're putting out, which is fair. When user security is a concern, there should probably be at the very least a thorough human review of AI-generated code.

But my personal take on the issue with vibe coding is less about the reduced quality of software, and more about the effect on the LLM user. Through experimenting with LLMs at various times, I've discovered that when it's used to implement something in your software project, the user really misses out on the opportunity to understand what they're implementing. This is what I struggle with if/when I decide to consult an LLM — the decision to take a pass on gaining that knowledge myself. Also, it becomes _very easy_ to lean on AI once you have a taste of the speed at which you can have a question answered. I think this particular element of LLMs will prove to be a net negative for society. It's really about having the willpower to refrain from using AI when you know it will benefit you to learn the thing yourself, and most people don't have that willpower.

So recently I thought of this helpful question to ask myself when working on a project: "If I consult an LLM right now, will it sabotage my goals in some way?" I think it could be a helpful mental brake if I'm going too fast and just want a quick LLM hit.

# Are there upsides?

All that being said, I think LLMs can be a helpful tool if used responsibly. This is also where I'll disagree a bit with ExtraTricky's extreme anti-LLM stance.

To revisit my GUI anecdote briefly and use it as an example: I think if you're someone who knows that you won't ever want to learn how to use a particular library, either because you'll only need it once or because you know it doesn't align with your goals broadly, then maybe it's OK to outsource that task to an LLM.

The stakes are not high for something like the optional GUI frontend in your personal / side project, so as long as you understand your core codebase / logic / backend, something like a GUI add-on is removed enough for you to keep it mentally separated. But to fully "vibe code" it in (i.e. to give the LLM a single prompt and to not bother verifying any functionality) would be doing yourself a disservice. If you're employing AI, it should be a good employee; the GUI (or whatever other feature it produces) should be up to your standards, otherwise you'd fire the employee.

I'm simply taking a stance here that perhaps AI should not be completely cast aside, _so long as you understand the implications of using it_. In software, you're not doing yourself any favors if you're telling the LLM to do everything for you. I think this is probably obvious to anyone who wants to learn. If you're OK using LLMs in this way, then you're probably someone trying to make a quick buck vibe coding the next Flappy Bird, and this post isn't for you.

Remember...

> "If I consult an LLM right now, will it sabotage my goals in some way?"  
> – Me

I've mostly talked about software development up till this point. But the same "With great power comes great responsibility"-type argument can be applied to other LLM usecases, like learning how to do something. If you're relying on LLMs to be your exclusive teacher or life coach, you're probably overusing it in its tutoring capacity, and/or forgetting that other sources of information exist and are perhaps more effective in the long run.

# AI in the (tech?) industry

ExtraTricky briefly mentions layoffs in the tech industry in his article. Having worked in the tech industry for the past 6-ish years, I wanted to share my views on the state of the industry, especially in relation to layoffs and the rise of AI.

There's a shift toward "AI native" in the industry. It's a design philosophy which embeds AI into the framework of something, as opposed to tacking it on after it's already built as an afterthought. Typically this refers to software and workflows, but I've also heard it in the context of people (employees). The better AI tools become, the more a company leans into them (invests in them) for the sake of productivity; this in turn means the expectations for employees to maximize their utilization of these tools increases.

But, as ExtraTricky notes, the quality of the software industry's output has declined over the past few years. Fully committing your company to generative AI and trusting it to produce software, data, and workflows is probably only going to worsen quality in the long run. The tech industry layoffs in the recent months are hard to ignore, and hard not to associate with the increased emphasis on leveraging AI to increase productivity.

Trust in leadership amongst employees naturally drops when a shift like this happens, and ironically productivity declines amid the low morale. It's hard to imagine increased software or product quality coming from a corporation where the human workforce is reduced in favor of letting the computer do everything — including think.

I myself have felt the pressure to maximize my AI tool utilization, to the point where it actually feels like thinking a problem through for myself would take too much time, and I might as well let AI do it. But the result is that I'm a step removed from the process and even if I do like the final output, I don't walk away with an understanding of what happened, and I'm not confident in my ability to reproduce it, explain it, or teach it.

# Human creative expression neutralized

The apparent effect of generative AI on the corporate world can also be applied to hobbies and creative endeavors. Crafts like art, music, writing, etc. are evidently being muddied by the existence of generative AI. I don't know if this is a worse effect on society than the "not thinking for yourself anymore" thing, but it might be on par. It's not that humans are no longer able to partake in these crafts (or maybe this is becoming more difficult too, as a side effect of the effects on thought?) but generative AI is producing the output of these crafts in ways that rival humans' ability. Arguably, of course, this doesn't matter because the point of the craft is the creative process itself, and AI doesn't reap the benefits of this like humans do. But the existence of human-looking but AI-created art, music, and prose might do one of two things:

1. Trick other humans into thinking it was the result of the human creative process. This just seems evil in some way, not sure how to expand upon how.
2. Inadvertently cause humans who know it was produced with AI to fall into the "I can use AI for this too" trap, and turn away from the creative process themselves.

There's also the exhausting experience of seeing more and more AI-generated content on the internet. I just don't have a desire to see it, personally. But it's hard to escape. And in the case of writing (I align with ExtraTricky here), I certainly don't want to read AI-written prose; I want to read something _because_ a human wrote it.

# My approach

While developing my thoughts and opinions on generative AI, through both personal experience and the writing process resulting in this post, I've been trying to simultaneously develop my own philosophy for how I personally approach and use AI. My view is still evolving, and perhaps in the future I'll lean more toward complete abstinence from AI usage.

## It's a tool
To answer the first, obvious question: yes, I use it. But as I've alluded to in this post, I try to think of it as a tool and avoid humanizing it or relying on it. It's something to help me reach my goals, not supplant them.

Just to add — and I'm probably not a trendsetter in this regard — but I don't like the abundance of "AI-powered features" in apps and websites and seemingly everywhere. That's all poorly executed capitalization on the utility of LLMs and they won't stand the test of time. The best implementation of LLMs, imo (aside from simple chatbot) is terminal-based coding agent.

## AI usage disclaimers
I've started to think about adding "AI usage disclaimers" to my project READMEs, my blog, and my website. I haven't fully decided how to implement this yet, but I like the idea generally.

The purpose of this would be to inform the user or reader that AI was not used in creating something (or if it was, to let them know of the extent to which AI touched it). Of course, there needs to be some blind trust from the user for them to believe it; but having that disclaimer is at least a signal to them that I'm thinking about it, and maybe this is enough to acquire that trust.

At the time of writing, I've already added such a disclaimer to the [README for Dexelect](https://github.com/Dechrissen/dexelect/blob/master/README.md), and I plan to do it for more of my software once I finalize the format. I'll need to figure out where to put it on my blog (or whether it should just be a website-wide disclaimer).


## Enjoying the process
Programming and writing are the two AI-susceptible fields I've talked about that also happen to be relevant to my life. Both of those things are hobbies for me, and as such I enjoy the actual process of partaking in them. Naturally, you wouldn't outsource your hobbies to a robot, otherwise they wouldn't be your hobbies.

Writing differs a bit from programming. In the case of writing, I already fully know _how_ to do it, and I don't really have any interest in formally studying the craft of writing to learn new techniques; I have a style, and I'm fine sticking to it. In the case of programming, I can't confidently say I'd know how to implement any given idea that pops into my head. More than half the time I need to research how to do something as I'm doing it.

I would never have an LLM write for me when the purpose of the writing is self-expression (and human to human communication). I wouldn't have an LLM draft prose or even outline it for me. I think that would defeat the purpose of writing. Sure, you _could_ have an LLM write an article for you based on some input criteria and even style guidelines inspired by your previous writings. But then the black box that is AI is serving to replace the part that matters most: the process.

As Tricky mentions in his post, the writing process serves to deepen your own understanding of _your own thoughts_ about the thing you're writing about. I think using LLMs in any step of the writing process is self-sabotage.

To contrast, I might use LLMs to aid me in software development, but again I need to recall some wise words I once heard:

> "If I consult an LLM right now, will it sabotage my goals in some way?"  
> – Me

The point is, I need to be intentional and responsible if I choose to use it. I should not pass off its output as my own. If I did that, I'd only be fooling myself.

![i made this](../static/images/i-made-this.jpg "i made this")

# Be careful I guess

At the end of his article, Tricky says this:

> "I believe the best thing for me to do right now is simply to be an example of someone working without AI, even if it takes a leap of faith for observers to believe in it."

I think this is a respectable thing to do. Obviously, I'm not going to take it this far. For me it's a good reminder that it's not a decision to be made lightly (whether to use it, how to use it, how not to use it). People are going to continue to use it daily, without a second thought, dangerously, etc.

But I think it's important to seriously consider the implications each time you use it, and to err on the side of being conservative with it. Because otherwise, it's going to _change your brain_ (not a joke). In a bad way. And I don't mean the advent of LLMs is going to change the way our brains evolve (that's probably guaranteed now), I mean the way you think will change in your lifetime if you're not careful. Like, in a couple years' time probably.

TLDR: If you use LLMs, your brain might change shape or even explode. You should trust me, I'm a guy on the internet.

Before I go, here's my new general AI usage disclaimer page: [How I Use AI](/md/how-i-use-ai)