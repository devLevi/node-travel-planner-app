const contryPost = {
    create: function(title, seasonToGo, description, currency, words, todo) {
        console.log('Creating new country plan');
        const country = {
            title: title,
            seasonToGo: seasonToGo,
            description: description,
            currency: currency,
            words: words,
            todo: todo,
            id: uuid.v4()
        };
        this.country[country.id] = country;
        return country;
    },
    get: function() {
        console.log('Retrieving country posts');
        return Object.keys(this.countries).map(key => this.countries[key]);
    },
    delete: function(id) {
        console.log(`Deleting country post \`${id}\``);
        delete this.countries[id];
    },
    update: function(updatedCountry) {
        console.log(`Updating shopping list item \`${updatedCountry.id}\``);
        const { id } = updatedCountry;
        if (!(id in this.countries)) {
            throw StorageException(
                `Can't update country \`${id}\` because doesn't exist.`
            );
        }
        this.items[updatedCountry.id] = updatedCountry;
        return updatedCountry;
    }
};
