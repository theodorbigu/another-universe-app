import { useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Input,
  Button,
  Image,
  VStack,
  Spinner,
} from "@chakra-ui/react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    setImageUrl(null);
    console.log("Generating image for prompt:", prompt);
    try {
      const response = await axios.post(
        "http://localhost:5001/generate-image",
        {
          prompt,
        }
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Image generation failed", error);
    }
    setLoading(false);
  };

  return (
    <Box bg="gray.50" minH="100vh" p={8}>
      <VStack spacing={4} align="stretch" maxW="lg" mx="auto">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Us in Another Universe
        </Heading>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your universe prompt..."
          size="lg"
          bg="white"
        />
        <Button
          onClick={generateImage}
          isLoading={loading}
          loadingText="Generating..."
          colorScheme="teal"
          size="lg"
          isDisabled={!prompt}
        >
          Generate
        </Button>

        {loading && (
          <Box textAlign="center" p={10}>
            <Spinner size="xl" color="teal.500" />
          </Box>
        )}

        {imageUrl && !loading && (
          <Box mt={6} boxShadow="md" borderRadius="md" overflow="hidden">
            <Image src={imageUrl} alt="Generated Universe" />
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default App;
