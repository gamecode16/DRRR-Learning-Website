const textElement = document.getElementById("text")
const optionButtonsElement = document.getElementById("option-buttons")

let state = {}

function startGame() {
    state = {}
    showTextNode(1)
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    textElement.innerText = textNode.text
    while (optionButtonsElement.firstElementChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }
    
    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button')
            button.innerText = option.text
            button.classList.add('btn')
            button.addEventListener('click', () => selectOption(option))
            optionButtonsElement.appendChild(button)
        }
    })
}

function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
}

function selectOption(option){
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    state = Object.assign(state, option.setState)
    showTextNode(nextTextNodeId)
}

const textNodes = [
    {
        id: 1,
        text: 'You saw a typhoon warning news on your TV.',
        options: [
            {
              text: 'Start planning',
              setState :{ startPlanning: true},
              nextText: 2
            },
            {
                text: 'Ignore news',
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        text: 'Over the next few days, the baranggay official of your baranggay told you to start preparing for the upcoming typhoon',
        options: [
            {
                text: 'Ignore officials',
                nextText: 3
            },
            {
                text: 'Just watch TV',
                nextText: 3
            },
            {
                text: 'Secure home',
                requiredState: (currentState) => currentState.startPlanning,
                setState: { startPlanning: false, secureHome: true},
                nextText: 3
            },
            {
                text: 'Remove outdoor objects',
                requiredState: (currentState) => currentState.startPlanning,
                setState: { startPlanning: false, outdoorObject: true},
                nextText: 3
            },
        ]

    },
    {
        id: 3,
        text: 'The typhoon is coming near, and the officials started issuing evacuation orders on low lying areas.',
        options: [
            {
                text: 'Gather supplies needed',
                requiredState: (currentState) => currentState.secureHome,
                setState: { secureHome: false, gatherSupplies: true,},
                nextText: 4   
            },
            {
                text: 'Contact family or friends',
                requiredState: (currentState) => currentState.secureHome,
                setState: { secureHome: false, contact: true},
                nextText: 5
            },
            {
                text: 'Check on neigbors',
                requiredState: (currentState) => currentState.outdoorObject,
                setState: { outdoorObject: false, neigbors: true},
                nextText: 4
            },
            {
                text: 'Ignore officials',
                nextText: 4
            }
        ]
    },
    {
        id: 4,
        text: 'It is starting to rain due to the typhoon hitting your place after a day.',
        options: [
            {
                text: 'Start evacuating',
                requiredState: (currentState) => currentState.gatherSupplies,
                setState: { gatherSupplies: false, evacuate: true},
                nextText: 6
            },
            {
                text: 'Stay inside your house',
                nextText: 5
            }
        ]
    },
    {
        id: 5,
        text: 'Your family and friends let you stay on their house.',
        options: [
            {
                text: 'Drive out and stay with them',
                requiredState: (currentState) => currentState.contact,
                setState: { contact: false, driveOut: true},
                nextText: 7
            },
            {
                text: 'Stay inside your house',
                nextText: 10
            }
        ]
    },
    {
        id: 6,
        text: 'You arrived at the evacuation center.',
        options: [
            {
                text: 'Stay there and wait',
                requiredState: (currentState) => currentState.evacuate,
                setState: { evacuate: false, stayThere: true},
                nextText: 8
            },
            {
                text: 'Go back to your house',
                requiredState: (currentState) => currentState.evacuate,
                setState: { evacuate: false, goBack: true},
                nextText: 11
            }
        ]
    },
    {
        id: 7,
        text: 'You have arrived at the house of your friend.',
        options: [
            {
                text: 'Stay there and wait',
                requiredState: (currentState) => currentState.driveOut,
                setState: { driveOut: false, friendsHouse: true},
                nextText: 9
            },
            {
                text: 'Go back to your house',
                requiredState: (currentState) => currentState.driveOut,
                setState: { driveOut: false, back: true},
                nextText: 11
            }
        ]
    },
    {
        id: 8,
        text: 'The heavy rain continued to pour down until the night. Then, a blackout occured.',
        options: [
            {
                text: 'Stay where you are',
                setState: { whereYou: true},
                nextText: 11.1
            },
            {
                text: 'Use flashlight',
                requiredState: (currentState) => currentState.stayThere,
                setState: { stayThere: false, flashLight: true},
                nextText: 11.1
            }
        ]
    },
    {
        id: 9,
        text: 'The heavy rain continued to pour down until the night. Then, a blackout occured.',
        options: [
            {
                text: 'Stay where you are',
                setState: { adults: true},
                nextText: 11.2 
            },
            {
                text: 'Use the generator',
                requiredState: (currentState) => currentState.friendsHouse,
                setState: { stay: false, generator: true},
                nextText: 11.2
            }
        ]
    },
    {
        id: 10,
        text: 'Because you stayed inside your house, and did not followed the officials, your house was destroyed by the typhoon and you were found dead.',
        options: [
            {
                text: 'Restart',
                nextText: -1,
            }
        ]
    },
    {
        id: 11,
        text: 'You arrived at your house.',
        options: [
            {
                text: 'Gather more supplies',
                requiredState: (currentState) => currentState.goBack,
                setState: { goBack: false, evacuate: true},
                nextText: 6
            },
            {
                text: 'Buy gasoline and supplies',
                requiredState: (currentState) => currentState.back,
                setState: { back: false, driveOut: true},
                nextText: 7
            }
        ]
    },
    {
        id: 11.1,
        text: 'The power outage continued until next day.',
        options: [
            {
                text: 'Save batteries for the night',
                requiredState: (currentState) => currentState.flashLight,
                setState: { flashLight: false, batteries: true},
                nextText: 12.1
            },
            {
                text: 'Use flashlight later',
                requiredState: (currentState) => currentState.whereYou,
                setState: { whereYou: false, flashlightLater: true},
                nextText: 12.3
            },
            {
                text: 'Use remaining batteries now',
                nextText: 12.2
            }
        ]
    },
    {
        id: 11.2,
        text: 'The power outage continued the next day.',
        options: [
            {
                text: 'Save gasoline for the generator',
                requiredState: (currentState) => currentState.generator,
                setState: { generator: false, gasoline: true},
                nextText: 13.1
            },
            {
                text: 'Let the adults use the generator',
                requiredState: (currentState) => currentState.adults,
                setState: { adults: false, letUse: true},
                nextText: 13.1
            },
            {
                text: 'Use generator now',
                nextText: 13.2
            }
        ]
    },
    {
        id: 12.1,
        text: 'As the typhoon continued to pass on land, the eye of the typhoon passed your place.',
        option: [
            {
                text: 'Stay still and wait until the typhoon pass by',
                requiredState: (currentState) => currentState.batteries,
                setState: { batteries: false, passBy: true},
                nextText: 15.1
            },
            {
                text: 'Venture outside the evacuation center',
                nextText: 14
            },
            {
                text: 'Use the time to check on your house',
                nextText: 14
            }
        ]
    },
    {
        id: 12.2,
        text: 'You have no batteries to use and your flashlight ran out of battery.',
        options: [
            {
                text: 'Continue',
                setState: { noBatteries: true},
                nextText: 15
            }
        ]
    },
    {
        id: 12.3,
        text: 'You use the flashlight.',
        options: [
            {
                text: 'Continue',
                setState: { usedFlashlight: true},
                nextText: 15
            }
        ]
    },
    {
        id: 13.1,
        text: 'As the typhoon continued to pass on land, the eye of the typhoon passed your place.',
        options: [
            {
                text: 'Stay still and wait until the typhoon pass by',
                requiredState: (currentState) => currentState.gasoline,
                setState: { gasoline: false, stayStill: true},
                nextText: 15.3
            },
            {
                text: 'Stay still and wait until the typhoon pass by',
                requiredState: (currentState) => currentState.letUse,
                setState: { letUse: false, still: true},
                nextText: 15.3
            },
            {
                text: 'Venture outside the house',
                nextText: 14
            },
            {
                text: 'Use time to buy gasoline',
                nextText: 15.1
            },
        ]
    },
    {
        id: 14,
        text: 'Because you ventured out and went back to your house, the eyewall passed your place and you got blew away by the strong winds of the eyewall.',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 15,
        text: 'The strong winds blew back and the heavy rains poured down once more, then you heard from other evacuees that there people trapped in a house at your place',
        options: [
            {
                text: 'Stay calm and do not panic',
                requiredState: (currentState) => currentState.noBatteries,
                setState: { noBatteries: false, stayCalm: true},
                nextText: 16.1
            },
            {
                text: 'Stay calm and do not panic',
                requiredState: (currentState) => currentState.usedFlashlight,
                setState: { usedFlashlight: false, calm: true},
                nextText: 16.1
            },
            {
                text: 'Start panicking',
                nextText: 16
            }
        ]
    },
    {
        id: 15.1,
        text: 'The strong winds blew back and the heavy rains poured down once more, then you heard from other evacuees that there people trapped in a house at your place',
        options: [
            {
                text: 'Stay calm and do not panic',
                requiredState: (currentState) => currentState.passBy,
                setState: { passBy: false, calmDown: true},
                nextText: 16
            },
            {
                text: 'Start panicking',
                nextText: 16
            }
        ]
    },
    {
        id: 15.2,
        text: 'Because you used the time to buy gasoline from a gasoline station few kilometers away from the house, your car got washed away by the flood caused by the typhoon',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 15.3,
        text: 'The strong winds blew back and the heavy rains poured down once more, then you heard from your father that there people trapped in a house at your place',
        options: [
            {
                text: 'Stay calm and do not panic',
                requiredState: (currentState) => currentState.stayStill,
                setState: { stayStill: false, calmDown: true},
                nextText: 16
            },
            {
                text: 'Stay calm and do not panic',
                requiredState: (currentState) => currentState.still,
                setState: { still: false, calmDown: true},
                nextText: 16
            },
            {
                text: 'Start panicking',
                nextText: 16
            }
        ]
    },
    {
        id: 16,
        text: 'After a day, the storm passed by but the authorities suggested to stay where you are until they can remove the broken power line, trees, and other debris left by the typhoon',
        options: [
            {
                text: 'Follow the officials',
                requiredState: (currentState) => currentState.calmDown,
                setState: { calmDown: false, follow: true},
                nextText: 17
            },
            {
                text: 'Ignore the officials',
                nextText: 17.2
            }
        ]
    },
    {
        id: 16.1,
        text: 'After a day, the storm passed by but the authorities suggested to stay where you are until they can remove the broken power line, trees, and other debris left by the typhoon',
        options: [
            {
                text: 'Follow the officials',
                requiredState: (currentState) => currentState.stayCalm,
                setState: { stayCalm: false, follow: true},
                nextText: 17
            },
            {
                text: 'Follow the officials',
                requiredState: (currentState) => currentState.calm,
                setState: { calm: false, follow: true},
                nextText: 17
            },
            {
                text: 'Ignore the officials',
                nextText: 17.2
            }
        ]
    },
    {
        id: 17,
        text: 'The authorities finally declared that it is safe to go back and check on your own houses.',
        options: [
            {
                text: 'Check on your house',
                requiredState: (currentState) => currentState.follow,
                setState: { follow: false, checkHouse: true },
                nextText: 18
            },
            
        ]
    },
    {
        id: 17.2,
        text: 'Because you did not followed the authorities and ventured outside while it is still unsafe, you hurt yourself.',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 18,
        text: 'You noticed that your house was unsafe.',
        options: [
            {
                text: 'Go inside anyway',
                nextText: 19
            },
            {
                text: 'Call authorities',
                requiredState: (currentState) => currentState.checkHouse,
                setState: { checkHouse: false, callAuthorities: true},
                nextText: 20
            }
        ]
    },
    {
        id: 19,
        text: 'Because you went inside your unsafe house, you hurt yourself.',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 20,
        text: 'The authorities came to check on your house to see if there were any things that needed to be fixed.',
        options: [
            {
                text: 'Take pictures of the damage for insurance purposes',
                setState: { houseChecked: true},
                nextText: 21
            },
            {
                text: 'Let authorities to their work',
                setState: { houseChecked: true},
                nextText: 21
            }
        ]
    },
    {
        id: 21,
        text: 'A day passed by and the local goverment unit started to give relief goods to the people affected by the typhoon.',
        options: [
            {
                text: 'Get some relief goods',
                requiredState: (currentState) => currentState.houseChecked,
                setState: { houseChecked: false, reliefGoods: true},
                nextText: 22
            }
        ]
    },
    {
        id: 22,
        text: 'Few days have passed and you finally got recovered from the typhoon. Your right decisions helped you with survive.',
        options: [
            {
                text: 'Congratulations!! You may leave the game or click to restart.',
                nextText: -1
            }
        ]
    }
]
startGame()