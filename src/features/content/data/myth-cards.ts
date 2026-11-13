import type { MythCard } from '@/features/content/types/content';

export const MYTH_CARDS: MythCard[] = [
  // sleep
  { id: 'm01', category: 'sleep', statement: 'Teenagers naturally tend to feel sleepy later at night than adults.', isMyth: false, explanation: 'Fact. During the teen years the body clock shifts later, which is why 10pm can feel early. A regular bedtime helps.' },
  { id: 'm02', category: 'sleep', statement: 'Scrolling in bed helps you fall asleep faster.', isMyth: true, explanation: 'Myth. Bright screens and busy feeds keep the brain alert. Putting the phone down a little before bed usually helps.' },
  { id: 'm03', category: 'sleep', statement: 'You can fully "catch up" on a whole week of short sleep on Sunday.', isMyth: true, explanation: 'Myth. A lie-in helps a bit, but regular sleep through the week works much better than one long Sunday.' },
  { id: 'm04', category: 'sleep', statement: 'Most people aged 13 to 18 need around 8 to 10 hours of sleep.', isMyth: false, explanation: 'Fact. Sleep experts suggest 8 to 10 hours for teens, and 7 to 9 for young adults.' },
  // health
  { id: 'm05', category: 'health', statement: 'Feeling thirsty is often one of the first signs you need water.', isMyth: false, explanation: 'Fact. Thirst is your body asking. On hot Mauritian days, sip through the day instead of waiting.' },
  { id: 'm06', category: 'health', statement: 'Exercise only counts if it lasts at least an hour.', isMyth: true, explanation: 'Myth. Short bits add up. A ten-minute walk or one song of dancing still does your body good.' },
  { id: 'm07', category: 'health', statement: 'Moving your body can lift your mood.', isMyth: false, explanation: 'Fact. Movement releases chemicals in the brain that help you feel calmer and happier.' },
  { id: 'm08', category: 'health', statement: 'Sunscreen is only needed on the beach.', isMyth: true, explanation: 'Myth. The sun in Mauritius is strong everywhere, even on cloudy days in Curepipe. Shade and sunscreen help.' },
  // stress
  { id: 'm09', category: 'stress', statement: 'A little stress before an exam can actually help you focus.', isMyth: false, explanation: 'Fact. Some nerves sharpen attention. When stress feels too big or lasts a long time, it is worth talking to someone.' },
  { id: 'm10', category: 'stress', statement: 'Talking about your worries makes them worse.', isMyth: true, explanation: 'Myth. Sharing a worry with someone you trust usually makes it feel lighter, not heavier.' },
  { id: 'm11', category: 'stress', statement: 'Slow breathing can help calm your body down.', isMyth: false, explanation: 'Fact. Breathing out slowly tells your nervous system that things are okay. Try a minute in the Mind world.' },
  { id: 'm12', category: 'stress', statement: 'If you feel sad sometimes, something must be wrong with you.', isMyth: true, explanation: 'Myth. Everyone feels sad sometimes. If it stays for weeks or feels heavy, talk to someone you trust.' },
  // online
  { id: 'm13', category: 'online', statement: 'Once you delete a photo you sent, it is gone for good.', isMyth: true, explanation: 'Myth. Someone may already have saved or screenshotted it. Only share what you would be okay with others seeing.' },
  { id: 'm14', category: 'online', statement: 'Most photos online are edited or filtered in some way.', isMyth: false, explanation: 'Fact. Lighting, filters and editing are everywhere. Comparing yourself to a feed is comparing to something made up.' },
  { id: 'm15', category: 'online', statement: 'It is fine to share your passwords with your best friend.', isMyth: true, explanation: 'Myth. Even good friendships change. Keep passwords to yourself and a trusted adult.' },
  { id: 'm16', category: 'online', statement: 'You can block and report someone who makes you uncomfortable online.', isMyth: false, explanation: 'Fact. Every major app lets you block and report. You never owe anyone a reply.' },
  // body
  { id: 'm17', category: 'body', statement: 'Everyone goes through puberty at exactly the same age.', isMyth: true, explanation: 'Myth. Puberty can start anywhere from around 8 to 14, and it moves at its own pace for everyone.' },
  { id: 'm18', category: 'body', statement: 'Periods can be irregular for the first year or two.', isMyth: false, explanation: 'Fact. It is common for cycles to take time to settle. If something worries you, a doctor or school nurse can help.' },
  { id: 'm19', category: 'body', statement: 'Growing pains and mood changes during the teen years are common.', isMyth: false, explanation: 'Fact. Hormones and growth bring big changes. You are not the only one feeling it.' },
  { id: 'm20', category: 'body', statement: 'You should not swim or exercise during your period.', isMyth: true, explanation: 'Myth. You can do whatever feels comfortable. Some people find gentle movement eases cramps.' },
  // studies and work
  { id: 'm21', category: 'studies', statement: 'Short breaks while studying help you remember more.', isMyth: false, explanation: 'Fact. Studying in blocks with short breaks helps your brain store what you learned.' },
  { id: 'm22', category: 'studies', statement: 'Some subjects are only for boys.', isMyth: true, explanation: 'Myth. Maths, coding, engineering, sport, science: there are women leading in all of them, including in Mauritius.' },
  { id: 'm23', category: 'studies', statement: 'Asking questions in class means you are not smart.', isMyth: true, explanation: 'Myth. Asking questions is how smart people learn. Often half the class wanted to ask the same thing.' },
  { id: 'm24', category: 'studies', statement: 'Sleeping well before an exam helps more than an all-nighter.', isMyth: false, explanation: 'Fact. Sleep is when the brain sorts and saves what you studied.' },
  // ocean
  { id: 'm25', category: 'ocean', statement: 'Coral is a plant.', isMyth: true, explanation: 'Myth. Coral is made of tiny animals called polyps, living together with algae that give them their colour.' },
  { id: 'm26', category: 'ocean', statement: 'Sea turtles can mistake plastic bags for jellyfish.', isMyth: false, explanation: 'Fact. A floating bag looks a lot like a jellyfish, a turtle favourite. That is one reason beach cleanups matter.' },
  { id: 'm27', category: 'ocean', statement: 'Mauritius is almost completely surrounded by a coral reef.', isMyth: false, explanation: 'Fact. A fringing reef rings most of the island, creating the calm lagoons you swim in.' },
  { id: 'm28', category: 'ocean', statement: 'Plastic in the sea breaks down completely within a year.', isMyth: true, explanation: 'Myth. Plastic breaks into smaller and smaller pieces called microplastics, which can last for hundreds of years.' },
  { id: 'm29', category: 'ocean', statement: 'Coral turns white when the water gets too warm.', isMyth: false, explanation: 'Fact. This is called bleaching. Coral can recover if the water cools down in time.' },
  { id: 'm30', category: 'ocean', statement: 'Blue Bay Marine Park is a protected area in Mauritius.', isMyth: false, explanation: 'Fact. Blue Bay Marine Park protects coral gardens with dozens of coral species and many kinds of fish.' },
];
