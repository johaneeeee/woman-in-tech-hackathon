import type { Quest } from '@/features/content/types/content';

export const QUESTS: Quest[] = [
  // BODY
  { id: 'body-01', world: 'body', moonPhase: 'new', title: 'Fill your bottle first', description: 'Before anything else today, fill a water bottle and keep it where you can see it. That is the whole intention.', xp: 10, kind: 'simple' },
  { id: 'body-02', world: 'body', moonPhase: 'new', title: 'Pick a bedtime', description: 'Choose a time to put your phone down tonight. Before 11pm is a good start. Write it somewhere you will see it.', xp: 10, kind: 'simple' },
  { id: 'body-03', world: 'body', moonPhase: 'waxing', title: 'Ten-minute walk', description: 'Walk for ten minutes. Round the block, to the boutik, along the beach. Music optional, no pace required.', xp: 15, kind: 'simple' },
  { id: 'body-04', world: 'body', moonPhase: 'waxing', title: 'Three glasses before lunch', description: 'Drink three glasses of water before midday. Tea counts if it is not too sweet.', xp: 10, kind: 'simple' },
  { id: 'body-05', world: 'body', moonPhase: 'waxing', title: 'Dance to one song', description: 'Put on one song you love and move to it. Sega, afrobeats, anything. Door closed is fine.', xp: 15, kind: 'simple' },
  { id: 'body-06', world: 'body', moonPhase: 'full', title: 'Walk with someone', description: 'Ask a friend, a cousin or your mum to walk with you for ten minutes. Talking is allowed.', xp: 15, kind: 'simple' },
  { id: 'body-07', world: 'body', moonPhase: 'full', title: 'Moonlight stretch', description: 'Step outside or open a window tonight. Reach up, roll your shoulders, touch your toes. Five slow minutes.', xp: 10, kind: 'simple' },
  { id: 'body-08', world: 'body', moonPhase: 'waning', title: 'Sleep before 11', description: 'Tonight, lights out before 11pm. Put the phone across the room so it is not the last thing you see.', xp: 15, kind: 'simple' },
  { id: 'body-09', world: 'body', moonPhase: 'waning', title: 'Slow stretch', description: 'Five minutes of gentle stretching: neck, shoulders, back, legs. Breathe out as you lean in.', xp: 10, kind: 'simple' },
  { id: 'body-10', world: 'body', moonPhase: 'waning', title: 'A proper rest', description: 'Take fifteen minutes doing nothing useful. Lie down, look at the ceiling, listen to the rain.', xp: 10, kind: 'simple' },

  // MIND
  { id: 'mind-01', world: 'mind', moonPhase: 'new', title: 'One line for this month', description: 'Write one line about what you want this moon cycle to feel like. Not a goal. A feeling.', xp: 15, kind: 'journal' },
  { id: 'mind-02', world: 'mind', moonPhase: 'new', title: 'How are you, honestly?', description: 'Check in with yourself. No right answer, nobody else sees it.', xp: 10, kind: 'mood' },
  { id: 'mind-03', world: 'mind', moonPhase: 'waxing', title: 'One minute of breathing', description: 'Sixty seconds. Breathe in as the circle grows, out as it shrinks. That is all.', xp: 10, kind: 'breathe' },
  { id: 'mind-04', world: 'mind', moonPhase: 'waxing', title: 'Mood check-in', description: 'Pick the face that is closest to how today feels. Lalin keeps a week of them for you.', xp: 10, kind: 'mood' },
  { id: 'mind-05', world: 'mind', moonPhase: 'waxing', title: 'One good thing', description: 'Write down one good thing from today. Small counts: a mango, a joke, a cool breeze.', xp: 15, kind: 'journal' },
  { id: 'mind-06', world: 'mind', moonPhase: 'full', title: 'Full moon check-in', description: 'The moon is full. How full do you feel? Pick a face.', xp: 10, kind: 'mood' },
  { id: 'mind-07', world: 'mind', moonPhase: 'full', title: 'Someone you are glad exists', description: 'Write the name of one person you are glad is in your life, and one word for why.', xp: 15, kind: 'journal' },
  { id: 'mind-08', world: 'mind', moonPhase: 'waning', title: 'Breathe it out', description: 'One minute of slow breathing before you sleep. Let the day go with each breath out.', xp: 10, kind: 'breathe' },
  { id: 'mind-09', world: 'mind', moonPhase: 'waning', title: 'Let one thing go', description: 'Write one thing you are ready to stop worrying about this week. Then close the app.', xp: 15, kind: 'journal' },
  { id: 'mind-10', world: 'mind', moonPhase: 'waning', title: 'Quiet check-in', description: 'How is your mood as the moon gets smaller? Pick a face.', xp: 10, kind: 'mood' },

  // GLOW
  { id: 'glow-01', world: 'glow', moonPhase: 'new', title: 'One thing you like about you', description: 'Say it out loud, or in your head if your little brother is listening. Not about looks. About you.', xp: 15, kind: 'simple' },
  { id: 'glow-02', world: 'glow', moonPhase: 'new', title: 'Name one brave thing', description: 'Decide on one slightly brave thing you will do this cycle. You do not have to tell anyone.', xp: 15, kind: 'simple' },
  { id: 'glow-03', world: 'glow', moonPhase: 'waxing', title: 'Ask one question', description: 'Ask a question in class or at work today. The one you were going to keep to yourself.', xp: 20, kind: 'simple' },
  { id: 'glow-04', world: 'glow', moonPhase: 'waxing', title: 'Try something new', description: 'Try one new thing today: a new route home, a dish at the market, a word in a new language.', xp: 15, kind: 'simple' },
  { id: 'glow-05', world: 'glow', moonPhase: 'waxing', title: 'Say no, kindly', description: 'If something does not feel right today, say no without saying sorry three times.', xp: 20, kind: 'simple' },
  { id: 'glow-06', world: 'glow', moonPhase: 'full', title: 'Compliment someone', description: 'Tell someone something you genuinely like about them. Their idea, their laugh, how they helped.', xp: 15, kind: 'simple' },
  { id: 'glow-07', world: 'glow', moonPhase: 'full', title: 'Share a small win', description: 'Tell a friend about one thing you did well this month. Bragging slightly is allowed.', xp: 15, kind: 'simple' },
  { id: 'glow-08', world: 'glow', moonPhase: 'waning', title: 'Thank past you', description: 'Think of something hard you got through this year. Say thanks to the girl who did it.', xp: 15, kind: 'simple' },
  { id: 'glow-09', world: 'glow', moonPhase: 'waning', title: 'Unfollow one account', description: 'Unfollow or mute one account that makes you feel worse after scrolling. Nobody is notified.', xp: 15, kind: 'simple' },
  { id: 'glow-10', world: 'glow', moonPhase: 'waning', title: 'Speak to yourself like a friend', description: 'Catch one harsh thought about yourself today and rewrite it the way you would say it to a friend.', xp: 20, kind: 'simple' },

  // LEARN
  { id: 'learn-01', world: 'learn', moonPhase: 'new', title: 'Myth or Fact: sleep', description: 'Five quick cards, a few about sleep. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-02', world: 'learn', moonPhase: 'new', title: 'Myth or Fact: studies and work', description: 'Five quick cards, a few about studying and work. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-03', world: 'learn', moonPhase: 'waxing', title: 'Myth or Fact: your body', description: 'Five quick cards, a few about growing up and how bodies change. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-04', world: 'learn', moonPhase: 'waxing', title: 'Myth or Fact: health', description: 'Five quick cards, a few about everyday health. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-05', world: 'learn', moonPhase: 'waxing', title: 'Myth or Fact: the ocean', description: 'Five quick cards, a few about the lagoon and what lives in it. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-06', world: 'learn', moonPhase: 'full', title: 'Myth or Fact: online', description: 'Five quick cards, a few about staying safe online. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-07', world: 'learn', moonPhase: 'full', title: 'Myth or Fact: the reef', description: 'Five quick cards, a few about coral and Mauritian seas. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-08', world: 'learn', moonPhase: 'waning', title: 'Myth or Fact: stress', description: 'Five quick cards, a few about stress and feelings. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-09', world: 'learn', moonPhase: 'waning', title: 'Myth or Fact: rest', description: 'Five quick cards, a few about sleep and rest. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
  { id: 'learn-10', world: 'learn', moonPhase: 'waning', title: 'Myth or Fact: screens', description: 'Five quick cards, a few about phones and the internet. Swipe right for fact, left for myth.', xp: 15, kind: 'cards' },
];

export const LEARN_QUEST_CATEGORY: Record<string, string> = {
  'learn-01': 'sleep',
  'learn-02': 'studies',
  'learn-03': 'body',
  'learn-04': 'health',
  'learn-05': 'ocean',
  'learn-06': 'online',
  'learn-07': 'ocean',
  'learn-08': 'stress',
  'learn-09': 'sleep',
  'learn-10': 'online',
};
