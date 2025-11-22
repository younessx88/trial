export interface Icebreaker {
  id: string;
  category: 'flirty' | 'funny' | 'thoughtful' | 'casual' | 'creative';
  text: string;
  followUp?: string;
  tags: string[];
}

export const ICEBREAKERS: Icebreaker[] = [
  // Flirty Icebreakers
  {
    id: 'flirt_001',
    category: 'flirty',
    text: "I was going to wait another day or two to message you, but I couldn't resist 😏",
    followUp: "So what have you been up to today?",
    tags: ['confident', 'playful']
  },
  {
    id: 'flirt_002',
    category: 'flirty',
    text: "I'm not usually this forward, but your profile stopped me mid-scroll",
    followUp: "What's your secret?",
    tags: ['direct', 'compliment']
  },
  {
    id: 'flirt_003',
    category: 'flirty',
    text: "Okay, I'll admit it - I swiped right purely because of your smile 😊",
    tags: ['honest', 'sweet']
  },
  {
    id: 'flirt_004',
    category: 'flirty',
    text: "If I asked you out for coffee, would you say yes? Asking for a friend... the friend is me 😅",
    tags: ['cute', 'direct']
  },
  {
    id: 'flirt_005',
    category: 'flirty',
    text: "I'd say something clever here, but I'm too distracted by how attractive you are",
    tags: ['honest', 'bold']
  },

  // Funny Icebreakers
  {
    id: 'funny_001',
    category: 'funny',
    text: "On a scale of 1-10, how disappointed will you be when you find out I'm not as funny in person? 🤔",
    tags: ['self-deprecating', 'humor']
  },
  {
    id: 'funny_002',
    category: 'funny',
    text: "I would've messaged sooner but I was busy training for the Olympics... in napping",
    tags: ['relatable', 'silly']
  },
  {
    id: 'funny_003',
    category: 'funny',
    text: "I'm conducting an important survey: pineapple on pizza - yes or no? Your answer determines everything.",
    followUp: "This is a very serious question 😂",
    tags: ['debate', 'food']
  },
  {
    id: 'funny_004',
    category: 'funny',
    text: "If you could have dinner with anyone, dead or alive, who would you choose? (I'm choosing you)",
    tags: ['clever', 'romantic']
  },
  {
    id: 'funny_005',
    category: 'funny',
    text: "Two truths and a lie: I'm great at cooking, I speak 3 languages, I'm definitely not making all of this up",
    tags: ['game', 'playful']
  },

  // Thoughtful Icebreakers
  {
    id: 'thought_001',
    category: 'thoughtful',
    text: "I noticed you love traveling - what's the one place that changed your perspective on life?",
    tags: ['deep', 'travel']
  },
  {
    id: 'thought_002',
    category: 'thoughtful',
    text: "Your bio mentioned [interest]. What got you into that?",
    tags: ['personalized', 'curious']
  },
  {
    id: 'thought_003',
    category: 'thoughtful',
    text: "If you could relive one day of your life, which would it be and why?",
    tags: ['deep', 'introspective']
  },
  {
    id: 'thought_004',
    category: 'thoughtful',
    text: "I saw you're into photography - what's the story behind your favorite photo?",
    tags: ['art', 'personal']
  },
  {
    id: 'thought_005',
    category: 'thoughtful',
    text: "What's something you're passionate about that most people don't know?",
    tags: ['genuine', 'deep']
  },

  // Casual Icebreakers
  {
    id: 'casual_001',
    category: 'casual',
    text: "Hey! How's your week going so far?",
    followUp: "Mine's been pretty good - just been [activity]",
    tags: ['simple', 'friendly']
  },
  {
    id: 'casual_002',
    category: 'casual',
    text: "Hi! Your profile caught my eye - what do you do for fun around here?",
    tags: ['local', 'activities']
  },
  {
    id: 'casual_003',
    category: 'casual',
    text: "Hey there! I saw you like [hobby] - me too! How long have you been into it?",
    tags: ['common interest', 'relatable']
  },
  {
    id: 'casual_004',
    category: 'casual',
    text: "Hey! Quick question - coffee person or tea person? ☕",
    tags: ['simple', 'preference']
  },
  {
    id: 'casual_005',
    category: 'casual',
    text: "Hi! Random question: what's the best thing that's happened to you this week?",
    tags: ['positive', 'conversation starter']
  },

  // Creative/Unique Icebreakers
  {
    id: 'creative_001',
    category: 'creative',
    text: "You're granted 3 wishes, but you can't wish for more wishes. What are they?",
    tags: ['hypothetical', 'fun']
  },
  {
    id: 'creative_002',
    category: 'creative',
    text: "If you had to survive a zombie apocalypse, what's your strategy?",
    tags: ['creative', 'game']
  },
  {
    id: 'creative_003',
    category: 'creative',
    text: "You can instantly become an expert at one thing. What do you choose?",
    tags: ['hypothetical', 'revealing']
  },
  {
    id: 'creative_004',
    category: 'creative',
    text: "If your life was a movie, what genre would it be and who would play you?",
    tags: ['creative', 'fun']
  },
  {
    id: 'creative_005',
    category: 'creative',
    text: "You win a free trip anywhere in the world. Where are you going and why?",
    tags: ['travel', 'dreams']
  },

  // More Flirty
  {
    id: 'flirt_006',
    category: 'flirty',
    text: "I have a confession: I've been staring at your profile for an embarrassing amount of time",
    tags: ['honest', 'sweet']
  },
  {
    id: 'flirt_007',
    category: 'flirty',
    text: "So when are we getting matching tattoos? Too soon? 😂",
    tags: ['playful', 'bold']
  },
  {
    id: 'flirt_008',
    category: 'flirty',
    text: "I'm terrible at opening lines, but I'm great at conversations over drinks. Wanna find out?",
    tags: ['confident', 'date suggestion']
  },

  // More Funny
  {
    id: 'funny_006',
    category: 'funny',
    text: "I was going to say 'hey gorgeous' but I chickened out. So... hey there, person I find attractive",
    tags: ['self-aware', 'awkward']
  },
  {
    id: 'funny_007',
    category: 'funny',
    text: "Roses are red, violets are blue, I'm not good at poems, but I'd like to talk to you",
    tags: ['poem', 'corny']
  },
  {
    id: 'funny_008',
    category: 'funny',
    text: "Do you believe in love at first swipe, or should I unmatch and match again?",
    tags: ['pun', 'meta']
  },

  // More Thoughtful
  {
    id: 'thought_006',
    category: 'thoughtful',
    text: "What's a small thing that brings you joy that others might not understand?",
    tags: ['deep', 'personal']
  },
  {
    id: 'thought_007',
    category: 'thoughtful',
    text: "If you could change one thing about the world, what would it be?",
    tags: ['values', 'deep']
  },

  // More Casual
  {
    id: 'casual_006',
    category: 'casual',
    text: "Hey! What's your go-to comfort food?",
    tags: ['food', 'easy']
  },
  {
    id: 'casual_007',
    category: 'casual',
    text: "Hi! Netflix or outdoor adventures?",
    tags: ['preference', 'lifestyle']
  },

  // Profile-Specific Templates
  {
    id: 'template_001',
    category: 'casual',
    text: "I noticed [specific detail from their profile] - that's really cool! [Question about it]?",
    tags: ['personalized', 'observant']
  },
  {
    id: 'template_002',
    category: 'thoughtful',
    text: "Your picture at [location] looks amazing! What's the story behind that trip?",
    tags: ['travel', 'photos']
  },
  {
    id: 'template_003',
    category: 'casual',
    text: "Fellow [shared interest] enthusiast! What got you into it?",
    tags: ['common ground', 'shared interest']
  },

  // Seasonal/Timely
  {
    id: 'seasonal_001',
    category: 'casual',
    text: "What are your plans for the weekend?",
    tags: ['timely', 'plans']
  },
  {
    id: 'seasonal_002',
    category: 'casual',
    text: "Happy [day of week]! What's your ideal way to spend a [day of week]?",
    tags: ['timely', 'casual']
  },

  // Question-based
  {
    id: 'question_001',
    category: 'creative',
    text: "Would you rather: have the ability to fly OR be invisible?",
    tags: ['would you rather', 'fun']
  },
  {
    id: 'question_002',
    category: 'creative',
    text: "What's your most unpopular opinion?",
    tags: ['controversial', 'fun']
  },
  {
    id: 'question_003',
    category: 'thoughtful',
    text: "If you could have dinner with anyone, dead or alive, who would it be?",
    tags: ['hypothetical', 'revealing']
  },

  // Compliment-based
  {
    id: 'compliment_001',
    category: 'flirty',
    text: "That smile though 😊 What's making you so happy in that photo?",
    tags: ['compliment', 'photo reference']
  },
  {
    id: 'compliment_002',
    category: 'casual',
    text: "Your style is 🔥 Where do you usually shop?",
    tags: ['fashion', 'compliment']
  },

  // Hobby-specific
  {
    id: 'hobby_001',
    category: 'casual',
    text: "Fellow foodie! What's the best restaurant you've been to lately?",
    tags: ['food', 'recommendations']
  },
  {
    id: 'hobby_002',
    category: 'casual',
    text: "I saw you're into fitness - any workout tips for someone getting back into it?",
    tags: ['fitness', 'advice']
  },
  {
    id: 'hobby_003',
    category: 'casual',
    text: "Music lover here too! What's on your playlist right now?",
    tags: ['music', 'current']
  },

  // Adventure/Travel
  {
    id: 'travel_001',
    category: 'thoughtful',
    text: "That beach photo is incredible! What was your favorite part of that trip?",
    tags: ['travel', 'beach']
  },
  {
    id: 'travel_002',
    category: 'casual',
    text: "Where's next on your travel bucket list?",
    tags: ['travel', 'future']
  },

  // Pet-related
  {
    id: 'pet_001',
    category: 'casual',
    text: "Is that your dog in your pic? They're adorable! What's their name?",
    tags: ['pets', 'dogs']
  },
  {
    id: 'pet_002',
    category: 'casual',
    text: "Cat person or dog person? This is very important information 🐱🐶",
    tags: ['pets', 'preference']
  },

  // Work/Career
  {
    id: 'career_001',
    category: 'thoughtful',
    text: "I saw you work in [field] - how did you get into that?",
    tags: ['career', 'story']
  },
  {
    id: 'career_002',
    category: 'casual',
    text: "What's the most interesting thing about your job?",
    tags: ['work', 'interesting']
  },

  // Books/Movies/TV
  {
    id: 'media_001',
    category: 'casual',
    text: "Currently binge-watching anything good?",
    tags: ['tv', 'recommendations']
  },
  {
    id: 'media_002',
    category: 'thoughtful',
    text: "What's a book that changed your perspective on something?",
    tags: ['books', 'deep']
  },
  {
    id: 'media_003',
    category: 'casual',
    text: "Marvel or DC? (There's only one right answer 😉)",
    tags: ['movies', 'debate']
  },

  // Sports
  {
    id: 'sports_001',
    category: 'casual',
    text: "I noticed you're a [team] fan! How long have you been following them?",
    tags: ['sports', 'team']
  },
  {
    id: 'sports_002',
    category: 'casual',
    text: "What sport do you like to play vs watch?",
    tags: ['sports', 'activities']
  },

  // Food & Drink
  {
    id: 'food_001',
    category: 'casual',
    text: "Okay, important question: what's your pizza order?",
    tags: ['food', 'preferences']
  },
  {
    id: 'food_002',
    category: 'casual',
    text: "Coffee or tea? And how do you take it?",
    tags: ['drinks', 'morning routine']
  },
  {
    id: 'food_003',
    category: 'casual',
    text: "What's your go-to midnight snack?",
    tags: ['food', 'habits']
  },

  // Location-specific
  {
    id: 'location_001',
    category: 'casual',
    text: "I see you're in [city] - what's your favorite spot around here?",
    tags: ['local', 'recommendations']
  },
  {
    id: 'location_002',
    category: 'casual',
    text: "New to [city] or have you been here a while?",
    tags: ['local', 'background']
  },

  // Weekend/Plans
  {
    id: 'plans_001',
    category: 'casual',
    text: "Got any fun plans this weekend?",
    tags: ['plans', 'weekend']
  },
  {
    id: 'plans_002',
    category: 'casual',
    text: "What does your perfect Saturday look like?",
    tags: ['ideal', 'weekend']
  },

  // Random Fun
  {
    id: 'random_001',
    category: 'funny',
    text: "Quick: French fries or onion rings?",
    tags: ['food', 'quick']
  },
  {
    id: 'random_002',
    category: 'creative',
    text: "If you could only eat one cuisine for the rest of your life, what would it be?",
    tags: ['food', 'hypothetical']
  },
  {
    id: 'random_003',
    category: 'funny',
    text: "Hot take: [something mildly controversial but fun]. Thoughts?",
    tags: ['debate', 'opinions']
  }
];

export class IcebreakerService {
  static getByCategory(category: Icebreaker['category']): Icebreaker[] {
    return ICEBREAKERS.filter(ib => ib.category === category);
  }

  static getByTags(tags: string[]): Icebreaker[] {
    return ICEBREAKERS.filter(ib =>
      tags.some(tag => ib.tags.includes(tag))
    );
  }

  static getRandom(count: number = 1): Icebreaker[] {
    const shuffled = [...ICEBREAKERS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  static getRandomByCategory(category: Icebreaker['category'], count: number = 1): Icebreaker[] {
    const filtered = this.getByCategory(category);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  static search(query: string): Icebreaker[] {
    const lowerQuery = query.toLowerCase();
    return ICEBREAKERS.filter(ib =>
      ib.text.toLowerCase().includes(lowerQuery) ||
      ib.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  static getRecommendations(userStyle: any, profileHints?: string[]): Icebreaker[] {
    // Simple recommendation logic based on user's tone preferences
    const { toneIndicators } = userStyle;

    let recommendedCategory: Icebreaker['category'] = 'casual';

    if (toneIndicators.flirty > 0.6) {
      recommendedCategory = 'flirty';
    } else if (toneIndicators.humorous > 0.6) {
      recommendedCategory = 'funny';
    } else if (toneIndicators.friendly > 0.7) {
      recommendedCategory = 'thoughtful';
    }

    return this.getRandomByCategory(recommendedCategory, 5);
  }
}
