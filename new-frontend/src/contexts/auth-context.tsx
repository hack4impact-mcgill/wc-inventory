import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client instance
import { Session, User } from '@supabase/supabase-js'; // Import types for Session and User from Supabase
import React, { createContext, useContext, useState, useEffect } from 'react'; // Import necessary React hooks and types

// Define the shape of the AuthContext
export interface AuthContextType {
    session: Session | null; // The current session, or null if not authenticated
    user: User | null; // The authenticated user, or null if not logged in
    signIn: (email: string, password: string) => Promise<void>; // Function to sign in a user
    signOut: () => Promise<void>; // Function to sign out a user
    isLoading: boolean; // Loading state while authentication is happening
}

// Create the AuthContext with an initial value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component that will provide auth context to its children
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null); // State for storing the current session
    const [user, setUser] = useState<User | null>(null); // State for storing the current user
    const [isLoading, setIsLoading] = useState(true); // State for managing loading status

    useEffect(() => {
        setIsLoading(true); // Set loading to true while fetching session
        // Fetch the current session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session); // Update session state
            setUser(session?.user ?? null); // Update user state if a session exists
            setIsLoading(false); // Set loading to false after fetching
        });

        // Subscribe to authentication state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session); // Update session state on auth state change
            setUser(session?.user ?? null); // Update user state on auth state change
            setIsLoading(false); // Set loading to false after change
        });

        // Cleanup subscription on component unmount
        return () => subscription.unsubscribe();
    }, []);

    // Function to sign in a user with email and password
    const signIn = async (email: string, password: string) => {
        setIsLoading(true); // Set loading to true while signing in
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password }); // Call Supabase sign-in method
            if (error) throw error; // Throw error if sign-in fails
        } finally {
            setIsLoading(false); // Set loading to false after sign-in attempt
        }
    };

    // Function to sign out the current user
    const signOut = async () => {
        setIsLoading(true); // Set loading to true while signing out
        try {
            const { error } = await supabase.auth.signOut(); // Call Supabase sign-out method
            if (error) throw error; // Throw error if sign-out fails
        } finally {
            setIsLoading(false); // Set loading to false after sign-out attempt
        }
    };

    // Create a value object to hold session, user, and authentication methods
    const value = {
        session,
        user,
        signIn,
        signOut,
        isLoading,
    };

    // Provide the AuthContext value to children components
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
const useAuthContext = () => {
    const context = useContext(AuthContext); // Get the current context value
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider'); // Error if context is undefined
    }
    return context; // Return the context value
};

// Export the AuthProvider, AuthContext, and custom hook
export { AuthProvider, AuthContext, useAuthContext };