import React from 'react'
import { Link } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    articleContainer: {
        margin: "10px 0",
    padding: "10px 10px",
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px #b5dfdcc9',
    },
  });

function ArticleCard(props) {
    const classes = useStyles();
    return (
        <div className={!props.noStyle ? classes.articleContainer : null} style={props.style}>
            <h3>{props.article.title}</h3>
            {props.article.authors && <div><strong>Authors:</strong> {props.article.authors.join(", ")}</div>}
            {props.article.abstract && <div><strong>Abstract:</strong> {props.article.abstract}</div>}
            {props.article.year && <div><strong>Year:</strong> {props.article.year}</div>}
            {props.article.doi && <div><strong>DOI:</strong> {props.article.doi}</div>}
            {props.article.ee && <div><strong>Article:</strong> <Link color="secondary" target="_blank" href={props.article.ee}>{props.article.ee}</Link></div>}
            {props.article.number && <div><strong>Number:</strong> {props.article.number}</div>}
            {props.article.pages && <div><strong>Pages:</strong> {props.article.pages}</div>}
            {props.article.type && <div><strong>Article type:</strong> {props.article.type}</div>}
            {props.article.url && <div><strong>DBLP URL:</strong> <Link color="secondary" target="_blank" href={props.article.url}>{props.article.url}</Link></div>}
            {props.article.venue && <div><strong>Venue:</strong> {props.article.venue}</div>}
            {props.article.volume && <div><strong>Volume:</strong> {props.article.volume}</div>}
        </div>
    )
}

export default ArticleCard


