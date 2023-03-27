import { Flex, Loader as MantineLoader } from "@mantine/core";

export function Loader() {
  return (
    <Flex h="100vh" justify="center" align="center">
      <MantineLoader size={64} />
    </Flex>
  );
}
