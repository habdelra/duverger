var chartDefinitions = {

  majorityFirstRound: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '20%', '20%', '10%', '20%', '30%' ]
  },

  majorityRunoff: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '20%', '0%', '0%', '0%', '80%' ]
  },
  majorityRunoffPreferenceChange: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '30%', '0%', '0%', '0%', '70%' ]
  },
  majorityFirstRoundSD60: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '15%', '15%', '8%', '15%', '46%' ]
  },
  majorityRunoffSD60: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '15%', '0%', '0%', '0%', '85%' ]
  },
  majorityFirstRoundSD80: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '13%', '13%', '7%', '13%', '53%' ]
  },
  majorityRunoffPreferenceChangeSD60: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '23%', '0%', '0%', '0%', '77%' ]
  },
  majorityRunoffSD30L0N0G0C30: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '50%', '0%', '0%', '0%', '50%' ]
  },
  plurality: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '20%', '20%', '10%', '20%', '30%' ]
  },
  pluralitySD60: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '15%', '15%', '8%', '15%', '46%' ]
  },
  pluralitySD30L0N0G0C30: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '50%', '0%', '0%', '0%', '50%' ]
  }

};

export default function(chartName) {
  return chartDefinitions[chartName];
}