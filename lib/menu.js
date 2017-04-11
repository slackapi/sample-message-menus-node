const menu = {
  items: [
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      options: ['milk'],
    },
    {
      id: 'americano',
      name: 'Americano',
      options: ['strength'],
    },
    {
      id: 'gibraltar',
      name: 'Gibraltar',
      options: ['milk'],
    },
    {
      id: 'latte',
      name: 'Latte',
      options: ['milk'],
    },
    {
      id: 'lavlatte',
      name: 'Lavendar Latte',
      options: ['milk'],
    },
    {
      id: 'mintlatte',
      name: 'Mint Latte',
      options: ['milk'],
    },
    {
      id: 'espresso',
      name: 'Espresso',
      options: ['strength'],
    },
    {
      id: 'espressomach',
      name: 'Espresso Macchiato',
      options: ['milk'],
    },
    {
      id: 'mocha',
      name: 'Mocha',
      options: ['milk'],
    },
    {
      id: 'tea',
      name: 'Hot Tea',
      options: ['milk'],
    },
  ],
  options: [
    {
      id: 'strength',
      choices: [
        {
          id: 'single',
          name: 'Single',
        },
        {
          id: 'double',
          name: 'Double',
        },
        {
          id: 'triple',
          name: 'Triple',
        },
        {
          id: 'quad',
          name: 'Quad',
        },
      ],
    },
    {
      id: 'milk',
      choices: [
        {
          id: 'whole',
          name: 'Whole',
        },
        {
          id: 'lowfat',
          name: 'Low fat',
        },
        {
          id: 'almond',
          name: 'Almond',
        },
        {
          id: 'soy',
          name: 'Soy',
        },
      ],
    },
  ],

  listOfTypes() {
    return menu.items.map(i => ({ text: i.name, value: i.id }));
  },

  listOfChoicesForOption(optionId) {
    return menu.options.find(o => o.id === optionId).choices
      .map(c => ({ text: c.name, value: c.id }));
  },

  choiceNameForId(optionId, choiceId) {
    const option = menu.options.find(o => o.id === optionId);
    if (option) {
      return option.choices.find(c => c.id === choiceId).name;
    }
    return false;
  },
};

module.exports = menu;
