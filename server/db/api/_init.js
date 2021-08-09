
const bcrypt = require('bcrypt');

const City = require('./City');
const State = require('./State');
const Admin = require('./Admin');

const STATE = (name, federativeUnit) => ({
  name, federativeUnit,
});

const STATES = [
  STATE('Acre', 'AC'),
  STATE('Alagoas', 'AL'),
  STATE('Amapá', 'AP'),
  STATE('Amazonas', 'AM'),
  STATE('Bahia', 'BA'),
  STATE('Ceará', 'CE'),
  STATE('Distrito Federal', 'DF'),
  STATE('Espírito Santo', 'ES'),
  STATE('Goiás', 'GO'),
  STATE('Maranhão', 'MA'),
  STATE('Mato Grosso', 'MT'),
  STATE('Mato Grosso do Sul', 'MS'),
  STATE('Minas Gerais', 'MG'),
  STATE('Pará', 'PA'),
  STATE('Paraíba', 'PB'),
  STATE('Paraná', 'PR'),
  STATE('Pernambuco', 'PE'),
  STATE('Piauí', 'PI'),
  STATE('Rio de Janeiro', 'RJ'),
  STATE('Rio Grande do Norte', 'RN'),
  STATE('Rio Grande do Sul', 'RS'),
  STATE('Rondônia', 'RO'),
  STATE('Roraima', 'RR'),
  STATE('Santa Catarina', 'SC'),
  STATE('São Paulo', 'SP'),
  STATE('Sergipe', 'SE'),
  STATE('Tocantins', 'TO'),
];

const init = async () => {
  // Insert all states.
  try { await State.insertMany(STATES); } catch (err) { console.log(err); }
  // Insert Montes Claros
  const doc = await State.findOne({ federativeUnit: 'MG' });
  if (doc) {
    const hasCity = await City.findOne({ stateId: doc._id, name: 'Montes Claros' });
    if (!hasCity) {
      const city = new City({
        stateId: doc._id,
        name: 'Montes Claros',
        timeZone: 'America/Sao_Paulo',
      });

      city.save();
    }
  }

  try {
    const newUser = new Admin();
    newUser.username = 'diegobezerra';
    newUser.password = bcrypt.hashSync('123', 10);
    newUser.save();
  } catch (err) {
    // ignore
    console.log(err);
  }
};

module.exports = init;
