import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

const Stack = createStackNavigator();

const personagens = [
  { name: 'Luke Skywalker', id: 1 },
  { name: 'Darth Vader', id: 4 },
  { name: 'Obi-Wan Kenobi', id: 10 },
  { name: 'Leia Organa', id: 5 },
  { name: 'R2-D2', id: 3 },
];

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personagens de Star Wars</Text>
      <FlatList
        data={personagens}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes', { id: item.id })}>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Text style={[styles.title, styles.atitus ]}>ATITUS</Text>
    </View>
  );
}

function DetalhesScreen({ route, navigation }) {
  const { id } = route.params;
  const [detalhes, setDetalhes] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [filmes, setFilmes] = useState([]);

  const som = async () => {
    const { sound } = await Audio.Sound.createAsync(require('./assets/lightsaber-sound.mp3'));
    await sound.playAsync();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
      setDetalhes(response.data);

      const veiculoPromises = response.data.vehicles.map(url => axios.get(url));
      const veiculoResponses = await Promise.all(veiculoPromises);
      setVeiculos(veiculoResponses.map(res => res.data));

      const filmPromises = response.data.films.map(url => axios.get(url));
      const filmResponses = await Promise.all(filmPromises);
      setFilmes(filmResponses.map(res => res.data));
    };

    fetchDetails();
  }, [id]);

  if (!detalhes) {
    return <Text>Carregando...</Text>;
  }

   return (
    <View style={styles.container}>
      <Text style={styles.title}>{detalhes.name}</Text>
      <Text style={styles.infoText}>Altura: {detalhes.height}</Text>
      <Text style={styles.infoText}>Peso: {detalhes.mass}</Text>
      <Text style={styles.infoText}>Cor do cabelo: {detalhes.hair_color}</Text>
      <Text style={styles.infoText}>Cor da pele: {detalhes.skin_color}</Text>
      <Text style={styles.infoText}>Cor dos olhos: {detalhes.eye_color}</Text>
      <Text style={styles.infoText}>Gênero: {detalhes.gender}</Text>
      <View style={styles.spacedText} />

      <View style={[styles.buttonContainer, {marginBottom: 5 }]}>
        <Button 
          title="Veículos" 
          onPress={async () => { 
            await som(); 
            navigation.navigate('Veiculos', { veiculos }); 
          }} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Filmes" 
          onPress={async () => { 
            await som(); 
            navigation.navigate('Filmes', { filmes }); 
          }} 
        />
      </View> 
      <View style={styles.spacedText} />
      <Text style={[styles.title, styles.atitus ]}>ATITUS</Text>
    </View>
  );
}

function VeiculosScreen({ route }) {
  const { veiculos } = route.params;

  if (veiculos.length === 0) {
    return(
      <View style={styles.container}>
        <Text>Não há veículos disponíveis.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículos</Text>
      <FlatList
        data={veiculos}
        renderItem={({ item }) => (
          <View style={styles.vehicleContainer}>
            <Text style={styles.infoText}>Nome: {item.name}</Text>
            <Text style={styles.infoText}>Modelo: {item.model}</Text>
            <Text style={styles.infoText}>Passageiros: {item.passengers}</Text>
            <View style={styles.spacedText} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={[styles.title, styles.atitus ]}>ATITUS</Text>
    </View>
  );
}

function FilmesScreen({ route }) {
  const { filmes } = route.params;

  if (filmes.length === 0) {
    return(
      <View style={styles.container}>
        <Text>Não há filmes disponíveis.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes</Text>
      <FlatList
        data={filmes}
        renderItem={({ item }) => (
          <View style={styles.filmContainer}>
            <Text style={styles.infoText}>Título: {item.title}</Text>
            <Text style={styles.infoText}>Diretor: {item.director}</Text>
            <Text style={styles.infoText}>Data de Lançamento: {item.release_date}</Text>
            <View style={styles.spacedText} /> 
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.spacedText} />
      <Text style={[styles.title, styles.atitus ]}>ATITUS</Text>
    </View>
  );
}

function SobreScreen() {
  const desenvolvedores = [
    {
      ra: '1135371',
      nome: 'André Izolani Rien',
      email: '1135371@atitus.edu.br',
    },{
      ra: '1135044',
      nome: 'Arthur Dezingrini',
      email: '1135044@atitus.edu.br',
    },
    {
      ra: '1135192',
      nome: 'Gabriel viecili',
      email: '1135192@atitus.edu.br',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre os Desenvolvedores</Text>
      <FlatList
        data={desenvolvedores}
        renderItem={({ item }) => (
          <View style={styles.developerContainer}>
            <Text style={styles.infoText}>RA: {item.ra}</Text>
            <Text style={styles.infoText}>Nome: {item.nome}</Text>
            <Text style={styles.infoText}>E-mail: {item.email}</Text>
            <View style={styles.spacedText} />
          </View>
        )}
        keyExtractor={(item) => item.ra}
      />
      <Text style={[styles.title, styles.atitus ]}>ATITUS</Text>
    </View>
  );
}

export default function App() {

  useEffect(() => {
    let soundObject;

    const playBackgroundSound = async () => {
      try {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('./assets/backgroundSound.mp3'));
        await soundObject.setIsLoopingAsync(true);
        await soundObject.playAsync();
      } catch (error) {
        console.error('Erro ao carregar ou tocar o som de fundo', error);
      }
    };

    playBackgroundSound();

    return () => {
      if (soundObject) {
        soundObject.unloadAsync(); 
      }
    };
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFD700', // Cor de fundo do header
          },
        }}
      >
      <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
              <Button
                title="Sobre"
                onPress={() => navigation.navigate('Sobre')}
              />
            </View>
            ),
          })}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        <Stack.Screen name="Veiculos" component={VeiculosScreen} />
        <Stack.Screen name="Filmes" component={FilmesScreen} />
        <Stack.Screen name="Sobre" component={SobreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  spacedText: {
    height: 15,
  },
  card: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#FFD700',
    borderWidth: 1,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
  },
  developerContainer: {
    marginBottom: 10,
    backgroundColor: '#222222',
    padding: 10,
    borderRadius: 5,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  atitus: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vehicleContainer: {
    backgroundColor: '#444444',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  filmContainer: {
    backgroundColor: '#444444',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  buttonContainer: {
    marginVertical: 10,
    backgroundColor: '#555555',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  headerStyle: {
    backgroundColor: '#FFD700',
  },
});