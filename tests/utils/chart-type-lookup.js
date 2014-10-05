var chartDefinitions = {

  majorityFirstRound: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '5%', '20%', '10%', '15%', '50%' ]
  },

  majorityRunoff: {
    colors: [
      '#BBDF2A',
      '#BBDF2A',
      '#BBDF2A',
      '#FB5258',
      '#FB5258'
    ],
    text: [ '5%', '20%', '10%', '15%', '50%' ]
  },
  majorityRunoffPreferenceChange: {
    colors: [
      '#BBDF2A',
      '#BBDF2A',
      '#BBDF2A',
      '#FB5258',
      '#FB5258'
    ],
    text: [ '5%', '20%', '10%', '15%', '50%' ]
  },
  majorityFirstRoundSD45: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '5%', '21%', '11%', '16%', '47%' ]
  },
  majorityRunoffSD45: {
    colors: [
      '#BBDF2A',
      '#BBDF2A',
      '#FB5258',
      '#FB5258',
      '#FB5258'
    ],
    text: [ '5%', '21%', '11%', '16%', '47%' ]
  },
  majorityFirstRoundSD80: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '4%', '15%', '8%', '12%', '62%' ]
  },
  majorityRunoffPreferenceChangeSD45: {
    colors: [
      '#BBDF2A',
      '#BBDF2A',
      '#BBDF2A',
      '#FB5258',
      '#FB5258'
    ],
    text: [ '5%', '21%', '11%', '16%', '47%' ]
  },
  majorityRunoffSD30L0N0G0C30: {
    colors: [
      '#777777',
      '#FB5258',
      '#FB5258',
      '#FB5258',
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
    text: [ '5%', '20%', '10%', '15%', '50%' ]
  },
  pluralitySD45: {
    colors: [
      '#777777',
      '#BBDF2A',
      '#F8DB3B',
      '#46C8B3',
      '#FB5258'
    ],
    text: [ '5%', '21%', '11%', '16%', '47%' ]
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
