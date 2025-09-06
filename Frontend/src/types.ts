export interface AuthResponse {
    token: string;
  }
  
  export interface User {
    id: number;
    username: string;
  }
  
  export interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }
  