import React from "react";

import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export default function PaginationButton(props) {
  return (
    <div
      //stylecenter
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      {
        <>
          {!props.pages.includes(1) && (
            <Button
              onClick={() => props.setPage(1)}
              style={{
                backgroundColor: props.page == 1 ? "#3182CE" : "#E2E8F0",
                color: props.page == 1 ? "#FFFFFF" : "#000000",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              1
            </Button>
          )}
          {props.pages &&
            props.pages.map((page, index) => {
              return (
                <Button
                  key={index}
                  onClick={() => props.setPage(page)}
                  style={{
                    backgroundColor:
                      page == props.currentPage ? "#3182CE" : "#E2E8F0",
                    color: page == props.currentPage ? "#FFFFFF" : "#000000",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                  disabled={page == props.currentPage || page == "..."}
                >
                  {page}
                </Button>
              );
            })}
          {props.lastPage != null &&
            !props.pages.includes(Number(props.lastPage)) &&
            props.lastPage > 1 && (
              <Button
                onClick={() => props.setPage(props.lastPage)}
                style={{
                  backgroundColor:
                    props.page == props.lastPage ? "#3182CE" : "#E2E8F0",
                  color: props.page == props.lastPage ? "#FFFFFF" : "#000000",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              >
                {props.lastPage}
              </Button>
            )}
        </>
      }
    </div>
  );
}
