// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        const speakOutput = 'Welcome, Choose your genre. Pop, Country, 80s/90s, or Classic Rock?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ChooseGenreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseGenre';
    },
    handle(handlerInput) {
        if (handlerInput.requestEnvelope.request.intent.slots.genre.resolutions &&
            handlerInput.requestEnvelope.request.intent.slots.genre.resolutions.resolutionsPerAuthority &&
            handlerInput.requestEnvelope.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0] &&
            handlerInput.requestEnvelope.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH"
        ) {
            var speakOutput = `You choosed ${handlerInput.requestEnvelope.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0].values[0].value.name};`;
            speakOutput += "Which singer is better?";
            speakOutput += `"option a";`;
            speakOutput += `Or is it;`;
            speakOutput += `"Option B";`;
            speakOutput += `Please make your selection now`;

            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.genre = handlerInput.requestEnvelope.request.intent.slots.genre.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            let replaceEntityDirective = {
                type: 'Dialog.UpdateDynamicEntities',
                updateBehavior: 'REPLACE',
                types: [
                    {
                        name: 'SingerOption',
                        values: [
                            {
                                id: '123',
                                name: {
                                    value: 'option one',
                                    synonyms: ['first one']
                                }
                            },
                            {
                                id: '124',
                                name: {
                                    value: 'option two',
                                    synonyms: ['socond one']
                                }
                            }
                        ]
                    }
                ]
            };


            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .addDirective(replaceEntityDirective)
                .getResponse();
        } else {
            const speakOutput = `sorry but i don't know this genre. please choose from Pop, Country, 80s/90s, or Classic Rock`;
            let updatedIntent = handlerInput.requestEnvelope.request.intent;
            delete updatedIntent.slots.genre.resolutions;
            delete updatedIntent.slots.genre.value;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addElicitSlotDirective("genre", updatedIntent)
                .getResponse();
        }
    }
};



const ChooseOptionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseOption';
    },
    handle(handlerInput) {
        if (!handlerInput.requestEnvelope.request.intent.slots.singerOption.value) {
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        }
        if (handlerInput.requestEnvelope.request.intent.slots.singerOption.resolutions &&
            handlerInput.requestEnvelope.request.intent.slots.singerOption.resolutions.resolutionsPerAuthority &&
            handlerInput.requestEnvelope.request.intent.slots.singerOption.resolutions.resolutionsPerAuthority[0] &&
            handlerInput.requestEnvelope.request.intent.slots.singerOption.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH"
        ) {
            var speakOutput = `option is choosed`;


            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } else {
            var speakOutput = `option is not choosed`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }

    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RequestInterceptor = {
    process(handlerInput) {
        console.log(`Request++++++ ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChooseGenreIntentHandler,
        ChooseOptionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
    )
    .addRequestInterceptors(
        RequestInterceptor,
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
