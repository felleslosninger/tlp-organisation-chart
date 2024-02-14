import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Home.module.css";
import { Button } from "@digdir/design-system-react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import cn from "classnames";
//import jsonData from "../../data/data1.json";
import Box from "../Box/Box";

export default function Home() {
  //console.log(jsonData);
  const [nestedMenu, setNested] = React.useState<any>(null);
  const [items, setItems] = React.useState([]);

  const code2 = `
    {
    "boxes": [
      {
        "title": "Direktør", 
        "id": "dir", 
        "backgroundColor": "#0062BA"
      },
      {
        "title": "Tilsynet for universell utforming av ikt", 
        "id": "tilsyn", 
        "url": "https://vg.no", 
        "parent": "dir",
        "offset": true,
        "backgroundColor": "#95227D"
      },
      {
        "title": "Kommunikasjon", 
        "id": "kom", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Verksemdstyring", 
        "id": "verk", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "HR", 
        "id": "hr", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Tverrgåande marknadsgruppe", 
        "id": "tverr", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Samanhengande tenester og livshendingar", 
        "id": "samenhengende_tjenester", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Seksjon 1", 
        "id": "seksjon_1", 
        "url": "https://vg.no", 
        "parent": "samenhengende_tjenester"
      },
      {
        "title": "Seksjon 2", 
        "id": "seksjon_2", 
        "url": "https://vg.no", 
        "parent": "samenhengende_tjenester"
      },
      {
        "title": "Digital strategi og samhandling", 
        "id": "digital_strategi", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Nasjonal arkitektur", 
        "id": "nasjonal_arkitektur", 
        "url": "https://vg.no", 
        "parent": "digital_strategi"
      }, 
      {
        "title": "Internasjonalt og analyse", 
        "id": "internasjonalt", 
        "url": "https://vg.no", 
        "parent": "digital_strategi"
      }, 
      {
        "title": "Fellesløysingar", 
        "id": "fellesløysinger", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Strategi og forretningsutvikling", 
        "id": "felles_strategi_forretning", 
        "url": "https://vg.no", 
        "parent": "fellesløysinger"
      }, 
      {
        "title": "Utvikling", 
        "id": "utvikling", 
        "url": "https://vg.no", 
        "parent": "fellesløysinger"
      }, 
      {
        "title": "Brukaroppleving og datadeling", 
        "id": "brukaroppleving", 
        "url": "https://vg.no", 
        "parent": "dir"
      },
      {
        "title": "Strategi og forretningsutvikling", 
        "id": "brukar_strategi_forretning", 
        "url": "https://vg.no", 
        "parent": "brukaroppleving"
      }, 
      {
        "title": "Utvikling", 
        "id": "strategi_utvikling", 
        "url": "https://vg.no", 
        "parent": "brukaroppleving"
      }
    ],
    "layout": [
      {
        "cols": [
          {
            "col": ["dir"]
          }
        ]
      },
      {
        "cols": [
          {
            "col": [""]
          },
          {
            "col": ["tilsyn"]
          }
        ]
      },
      {
        "cols": [
          {
            "col": ["kom", "verk"]
          },
          {
            "col": ["hr", "tverr"]
          }
        ]
      },
      {
        "cols": [
          {
            "col": ["samenhengende_tjenester"]
          },
          {
            "col": ["digital_strategi"]
          },
          {
            "col": ["fellesløysinger"]
          },
          {
            "col": ["brukaroppleving"]
          }
        ]
      }
    ]
  }
    `;
  const [code, setCode] = React.useState(code2);

  console.log("test");

  const test = () => {
    let json = JSON.parse(code);
    let boxes = json["boxes"];
    let layout = json["layout"];

    let myItems: any = [];

    layout.map((item: any, index: number) => {
      let row: any = {};
      row.cols = [];
      row.totalRows = layout.lenght;
      item.cols.map((col: any, colIndex: number) => {
        row.cols[colIndex] = [];
        col.col.map((col2: any, colIndex2: number) => {
          let currentBox = boxes.filter((box: any) => {
            return box.id === col2;
          });

          if (currentBox.length > 0) {
            currentBox = currentBox[0];
            currentBox.items = boxes.filter((box2: any) => {
              return currentBox.id === box2.parent;
            });

            row.cols[colIndex].push(currentBox);
          }
        });
        row.colLength = row.cols.length;
      });
      myItems.push(row);
    });
    console.log(myItems);
    setItems(myItems);
  };

  useEffect(() => {
    test();
  }, []);

  const createLineStyles = (rowItem: any, colItem: any, boxItem: any) => {
    return {
      backgroundColor: "#1e2b3c",
    };
  };

  const createMain = (rowItem: any) => {
    if (rowItem.colLength === 51) {
      return {
        height: "400px",
      };
    }
  };

  return (
    <main className={classes.main}>
      <Container fluid>
        <Row className="gx-4">
          <Col xl={12}>
            <h1 className={classes.title}>Lag organisasjonsKart</h1>
          </Col>
          {/* <Col xl={4}>
            <div className={classes.left}>
              <div className={classes.input}>
                <CodeEditor
                  value={code}
                  language="json"
                  placeholder="Please enter JS code."
                  padding={10}
                  minHeight={500}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  style={{
                    borderRadius: "4px",
                    fontSize: 13,
                    backgroundColor: "#1e2b3c",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </div>
              <Button
                className={classes.button}
                size="medium"
                onClick={() => {
                  test();
                }}
              >
                Generer org kart
              </Button>
            </div>
          </Col> */}
          <Col xl={12}>
            <div className={classes.output}>
              {items.map((rowItem: any, rowIndex: number) => (
                <div
                  key={rowIndex}
                  className={cn(
                    classes.row,
                    classes["row-" + rowItem.colLength],
                  )}
                >
                  <div
                    className={cn(classes.rowLine)}
                    style={createMain(rowItem)}
                  />
                  {rowItem.cols.map((colItem: any, colIndex: number) => (
                    <div
                      key={colIndex}
                      className={cn(classes.col, classes["col-" + colIndex])}
                    >
                      {colItem.map((boxItem: any, boxIndex: number) => (
                        <div key={boxIndex} className={classes.boxGroup}>
                          <div
                            className={cn(classes.boxLine)}
                            style={createLineStyles(rowItem, colItem, boxItem)}
                          />
                          <div className={classes.boxWrapper}>
                            <Box
                              link={boxItem.url}
                              href={boxItem.url}
                              target={boxItem.url ? "blank" : ""}
                              className={cn(classes.box, {
                                [classes.boxRight]: boxItem.offset,
                              })}
                              style={{
                                backgroundColor: boxItem.backgroundColor,
                              }}
                            >
                              {boxItem.title}
                            </Box>
                          </div>
                          {boxItem.items.length > 0 && boxItem.parent && (
                            <>
                              {boxItem.items.map((item: any, index: number) => (
                                <a
                                  href={item.url}
                                  target="blank"
                                  className={classes.underBox}
                                  key={index}
                                >
                                  {item.title}
                                </a>
                              ))}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
