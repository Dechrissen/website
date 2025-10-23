---
title: A Team Generator for Pokémon Games
date: 22 October 2025
number: 43
description: Discussing my new WIP project — a Pokémon team generator tool.
tags: pokemon, projects, games, programming
finished: true
---

I've started work on a new project that's been in the backlog for quite some time — a universal team generator for Pokémon games. If you don't know what that means, I don't blame you; it probably deserves a bit of clarification. The project isn't finished yet, but I think I have a good enough idea for the plan after thinking about it for a few weeks, so I want to write about it.

# Purpose

A _universal team generator_, as the name suggests, will generate a team (of Pokémon) for the user. But crucially, it's an external tool. It's _not_ a game add-on that will generate a random team for you within your game, rather, it's an application that will generate a list of six Pokémon for you to ultimately acquire in your game. It's "universal" in the sense that it will be compatible with most (or potentially all) generations of Pokémon games. Ideally, I'd like it to work for at least Gen 1 through Gen 4, since those are the ones I'm most concerned with for my playthroughs.

The goal is to have the tool generate a party for you (specific to the game you're playing), and then for you to attempt completing the game with that prescribed party. Of course, you won't be able to acquire the entire party at the start of the game — you'll have to play as normal, catching each subsequent party member along the way. The goal for the player is to _only_ use those 6 Pokémon in his or her playthrough, and by extension to use that final assembled party in defeating the Pokémon League. The team generator can be seen as a tool for adding an extra challenge.

# Motivation

The idea to make this came from my constant desire to find different ways to play Pokémon over and over, since I'm always starting a new playthrough of one of the games I consider good (Gen 1 through Gen 4, for the most part). I recognize that there are romhacks, fangames, randomizers and things like that, but I always gravitate toward the vanilla games. I like adding some challenge without overhauling the vanilla game too much.

I've written some [challenge rulesets](https://github.com/Dechrissen/pokemon-rulesets) in the past. Those types of self-imposed rulesets can be pretty challenging (which is a good thing). But sometimes, I just like to do a regular playthrough, and more recently when I do so I always make it a point to at least use some Pokémon that I haven't used (or beaten the game with) before. You can browse through my [Pokémon Team Archive](/md/pokemon-teams) to see some parties I've used recently.

I thought that adding the random element to my team construction would add an interesting twist to my desire to play the games in a _slightly-difficult-but-still-vanilla-but-not-completely-regular-sometimes_ way. Yeah, maybe this is a weird idea, but whatever. Like with my [Gen 1 romhack](/solus), I'm doing this because I _personally_ want it, not because I think it'll be a huge hit — but if other people can benefit from the finished product, that's great too.

Although, there is another interesting angle which a friend of mine pointed out to me after I explained this project to him. He said it could also be used for a "get this exact team race". To be clear, that would mean two competitors play the same game, generate one team with the tool, and then race each other to a) assemble that team, or b) complete the game with that team. I thought that was a very interesting bonus, so I plan to advertise that option somewhere (likely in the documentation) after the project is complete. It sounds like it could be fun.

# Challenges

This project has frankly been very difficult so far. I was surpised at how non-straightforward it was the more I started to think about it and issues started to arise. I've gone through a couple different iterations of what the end result should look like, how I'd get there, etc. It's been challenging to figure out how to encode certain pieces of game information into an optimal data format for the tool to use. And aside from that, there's the additional restriction I've imposed on myself which is that I'd like for the tool to be future-proof, where "future" = "up to Gen 4 (at least)".

I've started working on the tool with Gen 1 in mind, but it should ideally be able to work the same way for future generations without _any_ modifications to the way I encode game data, or the way the actual code interacts with that data. Once I've defined the necessary format for Gen 1's data, it should act as a template for any other game I'd like to add support for. Adding a new set of game data files for Gen 2 (for example) should allow the tool to start working immediately for Gen 2, provided I've encoded the data in the same way that I did for Gen 1.

The good news is that Pokémon, as a game, has mostly stayed the same over the years. For one thing, the games are actually quite linear. You might not think that at first because there are a few points when you can access branching paths. Take Lavender Town in Kanto for instance: when you arrive there from Rock Tunnel, you can go west to Route 8 toward Celadon, or south to Route 12 and explore for a bit. But really, there's nothing for you to do on Route 12's Silence Bridge until you acquire the Poké Flute. You need to head to Celadon first so you can get the Silph Scope for Pokémon Tower. So for the purposes of game progression, you don't technically have options.

My point in bringing that up is to set the scene for the first major challenge I faced. My initial vision for this tool was that it would generate a party for you, with the added stipulation that it would _strictly_ be a logically sound party, in the sense that the player is _only_ allowed to acquire the 6 Pokémon it generates. Logical progression would be considered and accounted for. By this, I mean all of the Pokémon generated would be generated according to what was actually possible for the player — so if X number of Pokémon are available before the first Cut tree in the game, then X minus [the amount of Pokémon that cannot learn Cut] = the amount of Pokémon that are eligible to be generated for Slot 1 of the party generation. The first member _needs_ to have Cut, otherwise the player cannot get to the point in the game where the Slot 2 member would be generated. The same then applies for the next chunk of progress. For example, the time between the first Cut tree and the first Rock Smash blockage, or whatever type of restriction you consider granular enough to dictate where the general cutoffs should be. It could even be the stretch of game from that first Cut tree and the second Gym, or something.

The point I think is that it's difficult to define what those progression chunks should be, particularly when you have such a strict system that can only generate Pokémon for the next available slot if it's "logically sound". This approach was very restrictive, both for the player (because he'd be limited to not using HM slaves or any "helper" Pokémon) and for my conceptualization of how to represent the progression in the data file.

Ultimately I scrapped that approach. I settled on a more loosely-defined idea of "progression" and a less restrictive set of criteria by which Pokémon could be generated. Specifically, I dropped the idea of logical progression in favor of "linear general progression" (a term I just now coined), and I dropped altogether the strict restriction on the player to use _only_ those six Pokémon generated.

This approach is a lot more forgiving, both to the player and to me, as I work on it. It also turns out that it's a lot easier to encode these games in terms of "linear general progression" rather than strict logical progression, particularly when trying to create a framework that can be applied to more games than just Gen 1.

## Linear general progression

I suppose I should elaborate on this term here. From the start, I thought it would make sense to represent the game in terms of chunks, or "[spheres](https://archipelago.gg/glossary/en/#sphere)" if you're familiar with Archipelago randomizer terminology (it's not exactly the same but I like the term and it fits decently well here).

Essentially, the first sphere of the game would be a representation of all the maps, Pokémon, and relevant items (HMs or evolution stones) that are
available to the player at the start of the game, or at least for the first X amount of time/progress/steps/whatever. The cutoff for the spheres is a bit vague. What matters is that the progression of the game (which is fairly linear) is represented by several sets of what's accessible at linear points through the game. After Sphere 1 is complete (or in this case, passed), then Sphere 2 becomes accessible, and so on till the final sphere.

The chunking of maps, Pokémon, items, etc. into spheres is how the "general progression" I referred to is encoded in the data files. The spheres act as a reference for the program to generate party members, because they're ordered (1, 2, 3, and so on until the end of the game).

This brings me to the structure of the spheres, and how I've chosen to represent that general progression. Each game needs to be represented by its own "logic file" (I'm not quite sure what I'm calling them yet — perhaps "progression file" or simply "data file"). They all have their own unique locations, Pokémon, Pokémon acqusition methods, evolution items, and HMs. A sphere is comprised of all of the locations you can access within that sphere, most importantly. But it also might include evolution items that can be purchased or picked up within that chunk of the game.

Here's an example `spheres` JSON snippet. Keep in mind this is hypothetical, these routes and items wouldn't make sense in the same sphere.

```
{
    "sphereNum": 1,
    "contents": [
        {"name": "Route1", "type": "map"},
        {"name": "Route2", "type": "map"},
        {"name":"Moon Stone", "type": "item"},
        {"name":"Super Rod", "type": "item"}
    ]
}
```

In the above Sphere 1 example, when the code checks the content of this sphere, it will first check for maps and "expand" them, meaning all available Pokémon for that map are added to the pool for Sphere 1. This collective pool represents the currently-available Pokémon that the program _could_ generate for your final six.

The next step would be checking for any items in the sphere. In the case of items, the program will keep track of them in a sort of "inventory" list. This inventory acts as a modifier to all current and future spheres. For example, if the Super Rod is in the inventory list, it acts as a key that unlocks all of the Super Rod encounters on a given map (the same maps that are represented in these spheres by `"type": "map"`).

A snippet of the `locations` JSON might help give context here.

```
{
    "map_name": "Route10",
    "walk": [
        "EKANS",
        "SPEAROW",
        "VOLTORB"
    ],
    "old_rod": [
        "MAGIKARP"
    ],
    "good_rod": [
        "GOLDEEN",
        "POLIWAG"
    ],
    "super_rod": [
        "POLIWHIRL",
        "SLOWPOKE"
    ]
}
```

Before the Old Rod, Good Rod, and Super Rod are in the inventory list, the only encounters accessible to the pool-generation code is the `walk` list from the above snippet. It's only when those items are added to the inventory that their respective lists are "unlocked" and become accessible to the generator.

The rods are just examples of items, and more exist (Poké Flute for instance, which unlocks Snorlax on two routes once the item is added).

As for how exactly the sphere data file is prepared, well, it has to be curated manually. It's basically a process of going through the progression of the game in my head and adding all of the maps and items to a master list, in order of appearance. After that, they can be split into spheres by deciding on cutoff points. (I'm not exactly sure how many spheres is ideal yet — this is still being worked on.)

But it turns out that quite a bit more is needed in order to generate a ... "progressively sound" party. I'm not sure what to call it. I suppose "logically sound" still works, but I don't want it to sound too strict and misleading.

Actually, that brings me to a relevant example of configuration options that will be available to the user. There are a lot of things to consider, one of which is the choice of whether you want your final six to collectively be able to learn all of the necessary HMs to (logically) complete the game. This, with many other settings, will be represented as a boolean in a config file, and the user can simply set it to `True` or `False`. If the user doesn't want to set that restriction, it will allow generation to be a bit more "powerful" in the sense that the final members would be selected from a more diverse pool. The downside is that an HM slave will likely be necessary for some parts of the game.

I won't bother with an exhaustive list, but here are a few more configuration options I have in mind:

- Whether to include your starter in the final six.
- Whether to include Pokémon that evolve by trade, or by some other method.
- How varied types should be across your party, or whether to avoid any overlapping types amongst members.
- Pokémon to blacklist.

So in order to achieve this Pokémon filtering functionality, naturally I need to encode all of these Pokémon traits in another data file. Here's what that might look like.

```
{
    "name": "dewgong",
    "is_fully_evolved": true,
    "evo_stage": 2,
    "species_line": "seel",
    "types": [
       "water",
       "ice"
    ],
    "is_legendary": false,
    "base_stat_total": 405,
    "hm_learnset": [
       "SURF",
       "STRENGTH"
    ],
    "evolution_method_required": "level-up"
}
```

# Future possibilities

As I said, I'd like for this tool to be easily expandable with additional "data files" (or "game files") which instantly unlock support for other games. To start, I'm working on support for vanilla Red/Blue (perhaps Yellow as well), and for my romhack [Pokémon Solus](/solus). But as I do so, I'm keeping in mind to develop it in such a way that will enable this frictionless support of other games.

Then, the idea is to add support for all of the remaining games I'm interested in: Gen 2, 3, and 4. But I plan to write clear documentation that will allow anyone to create their own data files following the schema I've defined. I think this is pretty cool — it will enable others to either add support for games post-Gen 4, or to add support for popular romhacks for Gens I've already implemented.

The tool is going to be visually plain, just a command line app. But I'm already thinking that this would be a good candidate for a GUI, either as a downloadable `.exe`, a web app, or a local HTML wrapper page that opens in a browser.

## Potential names

The name is not finalized yet. I've got a few ideas, though:

- `finalsix`
- `partygen`
- `teamgen`
- `uf6g` or `ufsg` (universal final six generator)
- `upg` (universal party generator)

Thanks for reading this unintentionally long post. I appreciate your attention. Cya.