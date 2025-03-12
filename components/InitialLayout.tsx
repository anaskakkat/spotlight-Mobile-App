import { useAuth } from '@clerk/clerk-expo'
import { Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'

const InitialLayout = () => {
    const { isLoaded, isSignedIn } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (!isLoaded) return

        const inAuthGroup = segments[0] === '(auth)';

        if (isSignedIn && inAuthGroup) {
            // Redirect to the authenticated screens
            router.replace('/(tabs)');
        } else if (!isSignedIn) {
            // Redirect to the login or public screens
            router.replace('/(auth)/login');
        }
    }, [isLoaded, isSignedIn, segments, router]);

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default InitialLayout
