import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { useRouter } from 'expo-router'; // Updated import

import { icons } from '../constants';
import { deleteVideoPost } from '../lib/appwrite'; // Ensure correct import

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  onPostDeleted,
}) => {
  const [play, setPlay] = useState(false);
  const router = useRouter(); // Use useRouter from expo-router

  const handleEdit = () => {
    router.push({ pathname: '/edit', params: { postId: $id } });
  };

  const handleDelete = async () => {
    try {
      await deleteVideoPost($id);
      Alert.alert('Success', 'Post deleted successfully');
      onPostDeleted($id);
    } catch (error) {
      console.error("Error deleting post:", error); // Log the error
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <Menu>
          <MenuTrigger>
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={0}>
              <Text>Like</Text>
            </MenuOption>
            <MenuOption onSelect={handleEdit}>
              <Text>Edit</Text>
            </MenuOption>
            <MenuOption onSelect={handleDelete}>
              <Text>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity onPress={() => setPlay(true)} className="w-full h-60 mt-3">
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
