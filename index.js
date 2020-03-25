/*
 * Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//
// Alexa Fact Skill - Sample for Beginners
//

// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

// core functionality for fact skill
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomFact = requestAttributes.t('FACTS');
    // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t('GET_FACT_MESSAGE') + randomFact;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      // Uncomment the next line if you want to keep the session open so you can
      // ask for another fact without first re-opening the skill
      // .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes i18next.
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const value = i18n.t(...args);
      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();

// TODO: Replace this data with your own.
// It is organized by language/locale.  You can safely ignore the locales you aren't using.
// Update the name and messages to align with the theme of your skill



const enData = {
  translation: {
    SKILL_NAME: 'Thrissur Facts',
    GET_FACT_MESSAGE: 'Here\'s your fact about Thrissur: ',
    HELP_MESSAGE: 'You can say tell me a Thrissur fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Thrissur Facts skill can\'t help you with that.  It can help you discover facts about Thrissur if you say tell me a Thrissur fact. What can I help you with?',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'Thrissur is known to be as Cultural City in Kerala',
        'Thrissur Pooram is a festival in Thrissur which is referred as festival of festivals',
        'Thrissur has many cultural and historical sites',
        'Thrissur is famous for Art',
        'Pulikali is one of the famous event during Onam at Thrissur',
        'The city is built around a 65-acre  hillock called the Thekkinkadu Maidan which seats the Vadakkumnathan temple.',
        'The City is widely acclaimed as the land of elephant lovers.',
        'The cuisine of Thrissur is linked to its history, geography, demography and culture. Rice is the staple food. Achappam,Kuzhalappam and Pazham Pori are common snacks. Vellayappam, a kind of rice hopper is another dish which is special to the city.',
        'Asias tallest church, the Our Lady of Dolours Syro-Malabar Catholic Basilica (Puthan Pally), Our Lady of Lourdes Syro-Malabar Catholic Metropolitan Cathedral which has an underground shrine, is a masterpiece of architecture.',
         'Guruvayoor, located 30 kms from Thrissur, is one of the most famous Hindu pilgrim centers in Kerala.',
         'Athirappilly waterfalls in Chalakkudy, Thrissur is one of the most popular tourism destinations in Kerala. Located right at the entrance of Sholayar ranges, the waterfalls at Athirappilly has soothing melodious rhythmic sounds that makes it so relaxing and rejuvenating.',
         'Chavakkad Beach is where you can hang out and watch the waves crashing against the rocks. It’s absolutely peaceful, quiet and you can blissfully enjoy the sunset sitting on the golden sands . The beach lies on the coast of Arabian Sea and is just 6 kilometers from Guruvayoor temple.',
         'Punnathur Kotta is an elephant sanctuary, located just three kilometres away from the Guruvayoor temple. You can head to the sanctuary after visiting the temple or sit in sweet surrender at the temple premises.',
         'Shakthan Thampuran Palace is one of the most impressive palaces in Kerala. You can walk around the well-maintained museum and its grounds, as those would help you draw insight into the annals of the ruling dynasty and erstwhile princely states of a bygone era.',
         'Vazhachal Falls in Chalakudy,Thrissur is one of famous water falls at thrissur',
         'Vazhachal is the only place in the Western Ghats where four endangered hornbill species are seen.',
      ],
  },
};

const enauData = {
  translation: {
    SKILL_NAME: 'Thrissur Facts',
  },
};

const encaData = {
  translation: {
    SKILL_NAME: 'Thrissur Facts',
  },
};

const engbData = {
  translation: {
    SKILL_NAME: 'Thrissur Facts',
  },
};

const eninData = {
  translation: {
    SKILL_NAME: 'Thrissur Facts',
  },
};

const enusData = {
  translation: {
    SKILL_NAME: ' Thrissur Facts',
  },
};


// constructs i18n and l10n data structure
const languageStrings = {
  'en': enData,
  'en-AU': enauData,
  'en-CA': encaData,
  'en-GB': engbData,
  'en-IN': eninData,
  'en-US': enusData,
  
};
