import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import { getAllUsers } from "../src/services/firebase/userService";
import Head from "next/head";
import RequireAuth from "../src/components/RequireAuth";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Kullanıcılar yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <RequireAuth>
     <Head>
          <title>Kullanıcılar • rsrichsoul</title>
        </Head>
      <Box p={5}>
        <Heading mb={6}>Kullanıcılar</Heading>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Adı</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={user.id}>
                <Td>{index + 1}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </RequireAuth>
  );
};

export default UsersPage;
