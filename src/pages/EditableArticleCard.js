import React from 'react'
import { Link } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    articleContainer: {
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px #b5dfdcc9',
    },
  });

function EditableArticleCard({article}) {
    const classes = useStyles();
    return (
        <div style={{
            margin: "10px 0",
            padding: "10px 10px",
            
        }}
        className={classes.articleContainer}>
            <h3>{article.title}</h3>
            {article.authors && <div><strong>Authors:</strong> {article.authors.join(", ")}</div>}
            {article.year && <div><strong>Year:</strong> {article.year}</div>}
            {article.doi && <div><strong>DOI:</strong> {article.doi}</div>}
            {article.url && <div><strong>URL:</strong> <Link color="secondary" target="_blank" href={article.url}>{article.url}</Link></div>}
        </div>
    )
}

export default EditableArticleCard


