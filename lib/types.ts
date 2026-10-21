export type ProductType = "Site" | "App";
export type ProductCategory = "sites" | "apps";

export interface Tech {
  n: string;
  d: string;
}

export interface Product {
  id: string;
  nome: string;
  tipo: ProductType;
  cat: ProductCategory;
  preco: number;
  resumo: string;
  desc: string[];
  tech: Tech[];
  incluso: string[];
  nota: string;
  aval: number;
  novo?: boolean;
  ativo: boolean;
}

export interface Order {
  oid: string;
  pid: string;
  email: string;
  cliente: string;
  data: string;
  valor: number;
}

export interface Question {
  id: string;
  pid: string | null;
  autor: string;
  email: string;
  q: string;
  a: string;
  status: "pending" | "answered";
  publico: boolean;
  data: string;
}

export type Role = "admin" | "client";

export interface User {
  nome: string;
  email: string;
  role: Role;
}

export interface Review {
  nome: string;
  neg: string;
  txt: string;
}
