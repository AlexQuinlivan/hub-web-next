"use client";

import {ChildrenList} from "@/app/modules/children/components/ChildrenList";
import Box from "@mui/material/Box";

export default function Root() {

  return (
    <main>

      <Box
        component="div"
        sx={{
          p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          maxLines: "1",
          maxWidth: "500px",
          fontFamily: "monospace",
          whiteSpace: "pre-line"
        }}
      >
        <ChildrenList/>
      </Box>


    </main>
  )
}
