// import nlp from 'compromise';
// import { ICON_SEARCH_MAP } from './iconDictionary.js';

// export const getDynamicIconName = (inputText) => {
//   // 1. Standardize the Fallback Object
//   const defaultStyle = { 
//     icon: 'BadgeIndianRupee', 
//     bg: 'bg-slate-100', 
//     color: 'text-slate-600' 
//   };

//   if (!inputText) return { icon: 'ShoppingBag', bg: 'bg-emerald-100', color: 'text-emerald-600' };

//   const lowerText = inputText.toLowerCase();
//   const doc = nlp(lowerText);
  
//   // 2. Extract all "Terms" (Individual words) instead of just full noun phrases
//   // This helps catch "rent" even if it's part of "house rent"
//   const words = doc.terms().out('array');
//   const nouns = doc.nouns().out('array');
  
//   // Combine nouns and all individual words to check
//   const candidates = [...new Set([...nouns, ...words])];

//   // 3. Search Loop
//   for (let candidate of candidates) {
//     // Clean the word (remove punctuation)
//     const cleanWord = candidate.replace(/[^\w\s]/gi, '');
    
//     // Check Singular version
//     const singular = nlp(cleanWord).nouns().toSingular().text() || cleanWord;
    
//     if (ICON_SEARCH_MAP[singular]) return ICON_SEARCH_MAP[singular];
//     if (ICON_SEARCH_MAP[cleanWord]) return ICON_SEARCH_MAP[cleanWord];
//   }

//   // 4. The "Failsafe" Check: String Includes
//   // If NLP missed it, we manually check if any of our keys exist inside the text
//   const dictionaryKeys = Object.keys(ICON_SEARCH_MAP);
//   for (let key of dictionaryKeys) {
//     if (lowerText.includes(key)) {
//       return ICON_SEARCH_MAP[key];
//     }
//   }

//   // 5. Final Fallbacks for specific verbs
//   if (lowerText.includes('buy')) return ICON_SEARCH_MAP['shopping'];
//   if (lowerText.includes('pay')) return { icon: 'CreditCard', bg: 'bg-blue-100', color: 'text-blue-600' };
  
//   return defaultStyle;
// };

import nlp from 'compromise';
import { ICON_SEARCH_MAP } from './iconDictionary.js';

export const getDynamicIconName = (inputText) => {
  const defaultStyle = { 
    icon: 'BadgeIndianRupee', 
    bg: 'bg-slate-100', 
    color: 'text-slate-600' 
  };

  if (!inputText) return { icon: 'ShoppingBag', bg: 'bg-emerald-100', color: 'text-emerald-600' };

  const lowerText = inputText.toLowerCase().trim();
  
  // 1. THE FAST MATCH (Failsafe)
  // We check the raw string first because it's the most reliable for "vegetable" vs "vegetables"
  const dictionaryKeys = Object.keys(ICON_SEARCH_MAP);
  for (let key of dictionaryKeys) {
    if (lowerText.includes(key)) {
      return ICON_SEARCH_MAP[key];
    }
  }

  // 2. THE NLP DEEP SEARCH
  const doc = nlp(lowerText);
  const words = doc.terms().out('array');

  for (let word of words) {
    const cleanWord = word.replace(/[^\w\s]/gi, '');
    
    // Check form A: Exactly as typed
    if (ICON_SEARCH_MAP[cleanWord]) return ICON_SEARCH_MAP[cleanWord];

    // Check form B: Singular version (using internal nlp transform)
    const singular = nlp(cleanWord).clone().nouns().toSingular().text();
    if (singular && ICON_SEARCH_MAP[singular]) return ICON_SEARCH_MAP[singular];

    // Check form C: Plural version
    const plural = nlp(cleanWord).clone().nouns().toPlural().text();
    if (plural && ICON_SEARCH_MAP[plural]) return ICON_SEARCH_MAP[plural];
  }

  // 3. VERB FALLBACKS
  if (lowerText.includes('buy') || lowerText.includes('purchase')) return ICON_SEARCH_MAP['shopping'];
  if (lowerText.includes('pay') || lowerText.includes('spent')) return { icon: 'CreditCard', bg: 'bg-blue-100', color: 'text-blue-600' };
  if (lowerText.includes('received') || lowerText.includes('get')) return ICON_SEARCH_MAP['salary'];
  
  return defaultStyle;
};