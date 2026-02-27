export interface User {
    id: string;
    email: string;
    role: 'Admin' | 'User';
    firstName?: string;
    lastName?: string;
    fullName?: string;
}

export interface LoginResponse {
    token: string;
    expiration?: string;    // legacy
    expiresAt?: string;     // backend field
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    confirmPassword?: string;
}
