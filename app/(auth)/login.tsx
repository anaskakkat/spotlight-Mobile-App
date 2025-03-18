import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const login = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  
  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting SSO Flow...");
      
      const response = await startSSOFlow({
        strategy: "oauth_google",
      });
  
      // console.log("Response:", response);
  
      const { createdSessionId, setActive } = response;
  
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.log("Session creation failed. Response:", response);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      {/* bran section  */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>

        <Text style={styles.appName}>Spotlight</Text>
        <Text style={styles.tagline}>Don't Miss Anything</Text>
      </View>
      {/* illustration section  */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/Online wishes-bro.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      {/* login section  */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.9}
          onPress={handleGoogleSignIn}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}> Continue With Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default login;
