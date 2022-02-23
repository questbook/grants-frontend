import {
  Divider, Flex, Image, Link, useTheme,
} from '@chakra-ui/react';
import React from 'react';

function Sidebar({
  children,
  links,
}: {
  children: React.ReactNode;
  links: { href: string; label: string; iconUrl: string }[];
}) {
  const theme = useTheme();
  return (
    <Flex
      bg={theme.colors.backgrounds.sidebar}
      w="100%"
      align="center"
      justify="space-between"
      direction="column"
    >
      {children}
      <Divider position="sticky" bottom={12} variant="sidebar" />
      <Flex bg={theme.colors.backgrounds.sidebar} position="sticky" bottom={0} w="100%" flexWrap="wrap" py={3} justify="center" px={8}>
        {links.map(({ href, label, iconUrl }, index) => (
          <Flex key={label} alignItems="center" ml={index === 0 ? 0 : 10}>
            <Image h="18px" w="14px" src={iconUrl} />
            <Link
              ml={3}
              fontSize="12px"
              lineHeight="24px"
              fontWeight="700"
              href={href}
              isExternal
            >
              {label}
            </Link>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default Sidebar;
