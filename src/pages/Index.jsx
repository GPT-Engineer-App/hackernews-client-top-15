import React, { useState, useEffect } from "react";
import { Container, VStack, Box, Heading, Link, Text, Spinner } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";

const Index = () => {
  const [topStories, setTopStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
      const storyIds = await response.json();
      const top15Ids = storyIds.slice(0, 15);

      const storiesPromises = top15Ids.map(async (id) => {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return storyResponse.json();
      });

      const stories = await Promise.all(storiesPromises);
      setTopStories(stories);
      setIsLoading(false);
    };

    fetchTopStories();
  }, []);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Top 15 Hacker News Stories
        </Heading>
        {isLoading ? (
          <Box textAlign="center">
            <Spinner size="xl" />
          </Box>
        ) : (
          topStories.map((story) => (
            <Box key={story.id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Heading fontSize="xl">{story.title}</Heading>
              <Text mt={4}>
                {story.score} points by {story.by}
              </Text>
              <Link href={story.url} isExternal color="teal.500">
                Read more <FaExternalLinkAlt />
              </Link>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
