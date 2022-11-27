interface ISessionsResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export { ISessionsResponseDTO };
