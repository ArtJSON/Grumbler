import { MantineProvider } from "@mantine/core";
import type { MantineThemeOverride } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import React, { useContext, useEffect, useState } from "react";
import type { ColorTheme } from "../../types/types";

const ThemeContext = React.createContext({
  theme: "dark",
  toggleTheme: () => {
    return;
  },
});

export default function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ColorTheme>("dark");

  useEffect(() => {
    setTheme(getCookie("color-theme") as ColorTheme);
  }, []);

  const toggleTheme = (value?: ColorTheme) => {
    const nextColorTheme = value || (theme === "dark" ? "light" : "dark");

    setTheme(nextColorTheme);
    setCookie("color-theme", nextColorTheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const darkTheme: MantineThemeOverride = {
    fontFamily: "Roboto Flex, sans-serif",
    colorScheme: "dark",
    other: {
      mode: theme,
    },
    components: {
      Textarea: {
        defaultProps: {
          styles: {
            label: {
              color: "#e4e5e7",
            },
            input: {
              fontSize: 16,
              backgroundColor: "#303136",
              color: "#e4e5e7",
              borderColor: "#303136",
              ":focus": {
                borderColor: "#303136",
              },
            },
          },
        },
      },
      Table: {
        defaultProps: {
          withColumnBorders: true,
          withBorder: true,
          style: {
            borderTop: "0",
            borderLeft: "0",
            borderRight: "0",
          },
        },
      },
      TextInput: {
        defaultProps: {
          styles: {
            label: {
              color: "#e4e5e7",
            },
            input: {
              fontSize: 16,
              backgroundColor: "#303136",
              color: "#e4e5e7",
              borderColor: "#303136",
              ":focus": {
                borderColor: "#303136",
              },
            },
          },
        },
      },
      Checkbox: {
        defaultProps: {
          styles: {
            label: {
              fontSize: 12,
              paddingLeft: 4,
            },
          },
        },
      },
      RichTextEditor: {
        defaultProps: {
          styles: {
            root: {
              borderColor: "#303136",
              overflow: "clip",
              ".ProseMirror": {
                backgroundColor: "#303136",
                color: "#e4e5e7",
              },
              "blockquote > *": {
                color: "#e4e5e7",
              },
              blockquote: {
                borderColor: "#494a50",
              },
            },
            content: {
              overflowY: "scroll",
              maxHeight: 500,
              fontSize: 16,
              backgroundColor: "unset",
            },
            toolbar: {
              backgroundColor: "#303136",
            },
            control: {
              backgroundColor: "#303136",
              color: "#e4e5e7",
              "&:hover": {
                backgroundColor: "#0c0c0d !important",
              },
            },
          },
        },
      },
      Loader: {
        defaultProps: {
          size: 48,
          color: "indigo",
        },
      },
    },
  };

  const lightTheme: MantineThemeOverride = {
    fontFamily: "Roboto Flex, sans-serif",
    colorScheme: "light",
    other: {
      mode: theme,
    },
    components: {
      Textarea: {
        defaultProps: {
          styles: {
            input: {
              fontSize: 16,
            },
          },
        },
      },
      Table: {
        defaultProps: {
          withColumnBorders: true,
          withBorder: true,
          style: {
            borderTop: "0",
            borderLeft: "0",
            borderRight: "0",
          },
        },
      },
      TextInput: {
        defaultProps: {
          styles: {
            input: {
              fontSize: 16,
            },
          },
        },
      },
      Checkbox: {
        defaultProps: {
          styles: {
            label: {
              fontSize: 12,
              paddingLeft: 4,
            },
          },
        },
      },
      RichTextEditor: {
        defaultProps: {
          styles: {
            content: {
              overflowY: "scroll",
              maxHeight: 500,
              fontSize: 16,
              backgroundColor: "unset",
            },
          },
        },
      },
      Loader: {
        defaultProps: {
          size: 48,
          color: "indigo",
        },
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      <MantineProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
