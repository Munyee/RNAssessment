import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  getLocationDetailByPlaceIdAction,
  searchPredictLocationByInputAction,
} from '../sagas/location.saga';
import {
  Location,
  setOpenSearch,
  setSearchHistory,
} from '../slices/location.reducer';

export default function AutoCompleteSearch() {
  const insets = useSafeAreaInsets();

  const inputRef = useRef<any>(null);

  const styles = useStyles(insets);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const predictLocations = useAppSelector(
    state => state.location.predictLocations,
  );
  const openSeach = useAppSelector(state => state.location.openSeach);
  const locationDetail = useAppSelector(state => state.location.locationDetail);
  const searchHistory = useAppSelector(state => state.location.searchHistory);

  const debounceInput = useRef(
    _.debounce((val: string) => {
      dispatch(searchPredictLocationByInputAction({input: val}));
    }, 800),
  ).current;

  useEffect(() => {
    if (locationDetail) {
      setSearch(locationDetail.formatted_address);
    }
  }, [locationDetail]);

  const handleSeachHistory = (item: Location) => {
    // handle search history
    const histories = searchHistory || [];
    //remove duplicate
    const previousHistory = histories.filter(
      history => history.place_id !== item.place_id,
    );
    const newHistory = [item, ...previousHistory];
    dispatch(setSearchHistory(newHistory));
    dispatch(getLocationDetailByPlaceIdAction(item.place_id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          ref={inputRef}
          onFocus={() => {
            dispatch(setOpenSearch(true));
          }}
          placeholder="Search"
          value={search}
          style={styles.searchInput}
          onChangeText={value => {
            setSearch(value);
            debounceInput(value);
          }}
        />
        <Icon
          name="close"
          size={20}
          onPress={() => {
            setSearch('');
            inputRef?.current?.focus();
          }}
        />
      </View>
      {openSeach && (
        <KeyboardAvoidingView>
          <View style={styles.resultContainer}>
            <ScrollView
              onScroll={() => {
                Keyboard.dismiss();
              }}
              style={styles.resultScrollView}>
              {!_.isEmpty(search) && (
                <>
                  {predictLocations?.map((item: any) => (
                    <TouchableOpacity
                      key={item.place_id}
                      onPress={() => {
                        handleSeachHistory(item);
                      }}>
                      <View style={styles.resultItem}>
                        <Text style={styles.resultText}>
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {
                //search history
                _.isEmpty(search) && (
                  <>
                    <View style={styles.recentView}>
                      <Text style={styles.recentText}>Recent</Text>
                    </View>

                    {(_.isNull(searchHistory) ||
                      searchHistory.length === 0) && (
                      <View style={styles.noSearchView}>
                        <Text>No Recent Search</Text>
                      </View>
                    )}
                    {searchHistory &&
                      searchHistory.length > 0 &&
                      searchHistory.map((item: any) => (
                        <TouchableOpacity
                          key={item.place_id}
                          onPress={() => {
                            handleSeachHistory(item);
                          }}>
                          <View style={styles.resultItem}>
                            <Text style={styles.resultText}>
                              {item.description}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </>
                )
              }
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const useStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      zIndex: 10,
      top: insets.top,
      width: '100%',
      padding: 10,
    },
    searchContainer: {
      paddingVertical: Platform.OS === 'ios' ? 15 : 8,
      paddingHorizontal: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchInput: {
      fontSize: 15,
      flexGrow: 1,
      width: '95%',
    },
    resultContainer: {
      paddingTop: 10,
    },
    resultScrollView: {
      maxHeight:
        Dimensions.get('window').height - insets.top - insets.bottom - 200,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    resultItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    resultText: {
      color: '#000',
    },
    recentView: {
      padding: 15,
      paddingBottom: 10,
    },
    recentText: {
      fontSize: 12,
      color: '#666',
    },
    noSearchView: {
      padding: 15,
    },
  });
