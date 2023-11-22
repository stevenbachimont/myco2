function calculateCarbon() {
    // Récupération des valeurs du formulaire
    var electricity = parseFloat(document.getElementById("electricity").value);
    var gas = parseFloat(document.getElementById("gas").value);
    var carDistance = parseFloat(document.getElementById("carDistance").value);
    var trainDistance = parseFloat(document.getElementById("trainDistance").value);
    var flightDistance = parseFloat(document.getElementById("flightDistance").value);
    var appliances = parseFloat(document.getElementById("appliances").value);
    var electronics = parseFloat(document.getElementById("electronics").value);
    var redMeatConsumption = parseFloat(document.getElementById("redMeatConsumption").value);
    var whiteMeatConsumption = parseFloat(document.getElementById("whiteMeatConsumption").value);
    var porkConsumption = parseFloat(document.getElementById("porkConsumption").value);
    var housingType = document.getElementById("housingType").value;
    var housingSize = parseFloat(document.getElementById("housingSize").value);
    var bulkFoodPurchase = document.getElementById("bulkFoodPurchase").value;
    var occupants = parseFloat(document.getElementById("occupants").value);
    var largeClothingPurchase = parseFloat(document.getElementById("largeClothingPurchase").value);
    var smallClothingPurchase = parseFloat(document.getElementById("smallClothingPurchase").value);

    // Facteurs d'émissions de carbone en kg de CO2 par unité
    var emissionFactors = {
        electricity: 0.4,
        gas: 0.2,
        car: 0.2,
        train: 0.5,
        flight: 0.25,
        appliance: 0.1,
        electronic: 0.05,
        redMeat: 14,
        whiteMeat: 7,
        pork: 12,
        apartment: 15,
        house: 20,
        servicesCommuns: 1500,
        clothing: {
            large: 20,
            small: 10
        }
    };

    // Calcul des émissions de carbone pour chaque catégorie
    var transportEmissions = (carDistance * emissionFactors.car) +
        (trainDistance * emissionFactors.train) +
        (flightDistance * emissionFactors.flight);

    var housingEmissions = (electricity * emissionFactors.electricity / occupants) +
        (gas * emissionFactors.gas / occupants) +
        (emissionFactors[housingType] * occupants * housingSize / occupants);

    var redMeatEmissions = redMeatConsumption * emissionFactors.redMeat;
    var whiteMeatEmissions = whiteMeatConsumption * emissionFactors.whiteMeat;
    var porkEmissions = porkConsumption * emissionFactors.pork;

    var foodEmissions = redMeatEmissions + whiteMeatEmissions + porkEmissions;

    var appliancesElectronicsEmissions = (appliances * emissionFactors.appliance / occupants) +
        (electronics * emissionFactors.electronic);

    // Ajout de l'impact de l'achat en vrac
    var bulkFoodPurchaseFactor = getBulkFoodPurchaseFactor(bulkFoodPurchase);
    foodEmissions *= bulkFoodPurchaseFactor;

    // Calcul des émissions de carbone pour les vêtements
    var clothingEmissions = (largeClothingPurchase * emissionFactors.clothing.large) +
        (smallClothingPurchase * emissionFactors.clothing.small);

    // Calcul du total des émissions de carbone
    var totalEmissions = transportEmissions + (housingEmissions + appliancesElectronicsEmissions) + foodEmissions + clothingEmissions + emissionFactors.servicesCommuns;

    // Affichage du résultat
    document.getElementById("result").textContent = totalEmissions.toFixed(2);

    // Création d'un graphique
    var ctx = document.getElementById('carbonChart').getContext('2d');
    var labels = ['Transport', 'Logement', 'Nourriture', 'Vêtements & électronique', 'Services Communs'];
    var data = [transportEmissions, (housingEmissions + appliancesElectronicsEmissions), foodEmissions, clothingEmissions, emissionFactors.servicesCommuns];

    if (window.myChart) {
        window.myChart.destroy(); // Détruire le graphique précédent
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Émissions de CO2 (kg)',
                data: data,
                backgroundColor: ['rgba(141,13,56,0.67)', 'rgba(95, 207, 163, 0.67)', 'rgba(32, 137, 255, 0.67)', 'rgba(255, 165, 0, 0.67)', 'rgba(255, 0, 0, 0.67)'],
                borderColor: 'rgb(132,75,192)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour obtenir le facteur d'achat en vrac en fonction de la sélection
function getBulkFoodPurchaseFactor(selection) {
    switch (selection) {
        case 'never':
            return 1;
        case 'occasionally':
            return 0.8;
        case 'regularly':
            return 0.5;
        case 'always':
            return 0.3;
        default:
            return 1;
    }
}