import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import {getCollections, getEthPrice} from '../../api/index';

const Home = () => {
  const [nft, setAssets] = useState([]);
  const [collections, setCollections] = useState();
  const [ethPrice, setEthPrice] = useState();
  const [address, setAddress] = useState();
  const [priceType, setPriceType] = useState(false);

  useEffect(() => {
    getEthPrice().then(res => {
      setEthPrice(res.result.ethusd);
    });
  }, []);

  let calculateAvgNetWorth = () => {
    let total = 0;
    console.log(`collections`, collections);
    let coll = collections.sort((a, b) => {
      return (
        b.stats.average_price * b.owned_asset_count -
        a.stats.average_price * a.owned_asset_count
      );
    });
    coll.forEach(asset => {
      total += asset.stats.average_price * asset.owned_asset_count;
    });

    return total;
  };
  let calculateFloorNetWorth = () => {
    let total = 0;
    console.log(`collections`, collections);
    let coll = collections.sort((a, b) => {
      return (
        b.stats.floor_price * b.owned_asset_count -
        a.stats.floor_price * a.owned_asset_count
      );
    });
    coll.forEach(asset => {
      total += asset.stats.floor_price * asset.owned_asset_count;
    });

    return total;
  };

  /*  getCollections(address).then(res => {
    console.log(`res`, res);
    if (res.length > 0) {
      setCollections(res);
    }
  });

  console.log(`collections`, collections); */

  return (
    <View>
      <View style={{marginTop: 10, marginHorizontal: 20}}>
        <Text style={{marginVertical: 5, fontSize: 16, fontWeight: '600'}}>
          Insert your address:
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Wallet address"
          onChangeText={text => {
            setAddress(text);
          }}
          onSubmitEditing={text => {
            setAddress(text);
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            padding: 10,
            marginTop: 10,
          }}
          onPress={() => {
            getCollections(address).then(res => {
              if (res.length > 0) {
                setCollections(res);
              }
            });
          }}>
          <Text style={{color: '#fff'}}>Get collections</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: priceType ? '#fff' : '#000',
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => {
              setPriceType(false);
            }}>
            <Text style={{color: priceType ? '#000' : '#fff'}}>Average</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              backgroundColor: priceType ? '#000' : '#fff',
              padding: 10,
              marginTop: 10,
            }}
            onPress={() => {
              setPriceType(true);
            }}>
            <Text style={{color: priceType ? '#fff' : '#000'}}>Floor</Text>
          </TouchableOpacity>
        </View>
        {collections && (
          <View>
            <Text style={{marginTop: 10}}>
              Collections: {collections.length}
            </Text>
            <Text style={{marginTop: 10}}>
              ETH worth:{' '}
              {priceType
                ? calculateFloorNetWorth().toFixed(4)
                : calculateAvgNetWorth().toFixed(4)}
              ETH
            </Text>
            <Text style={{marginTop: 10}}>
              USD worth: ~$
              {priceType
                ? (calculateFloorNetWorth() * ethPrice).toFixed(2)
                : (calculateAvgNetWorth() * ethPrice).toFixed(2)}
            </Text>
          </View>
        )}
        {/* <Text style={{marginVertical: 20}}>
          NFT NET WORTH: {calculateNetWorth().toFixed(4)}Ξ ~$
          {(calculateNetWorth() * ethPrice).toFixed(2)}
        </Text> */}
      </View>
      {/* <View style={{height: '1000%'}}> */}
      <FlatList
        style={{width: '100%'}}
        contentContainerStyle={{
          paddingBottom: 250,
          paddingTop: 20,
        }}
        data={collections}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {}}
            style={{marginTop: 10, marginLeft: 20, flexDirection: 'row'}}>
            <Image
              style={{width: 100, height: 100, marginRight: 10}}
              source={{uri: item.image_url}}
            />
            <View>
              <Text style={{fontSize: 16, fontWeight: '600'}}>{item.name}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text>
                  {priceType ? 'Floor' : 'Avg.'} price:{' '}
                  {priceType
                    ? item.stats.floor_price.toFixed(4)
                    : item.stats.average_price.toFixed(4)}
                  Ξ
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text>
                  Floor sum:{' '}
                  {priceType
                    ? (item.stats.floor_price * item.owned_asset_count).toFixed(
                        4,
                      )
                    : (
                        item.stats.average_price * item.owned_asset_count
                      ).toFixed(4)}
                  Ξ
                </Text>
                <Text style={{marginLeft: 5}}>
                  $
                  {priceType
                    ? (
                        (
                          item.stats.floor_price * item.owned_asset_count
                        ).toFixed(4) * ethPrice
                      ).toFixed(2)
                    : (
                        (
                          item.stats.average_price * item.owned_asset_count
                        ).toFixed(4) * ethPrice
                      ).toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text style={{textAlign: 'center', marginVertical: 50}}>
              No assets :(
            </Text>
          </View>
        }
      />
    </View>
    // </View>
  );
};

export default Home;
