import React from "react";
import Chip from "material-ui/Chip";
import { blue300 } from "material-ui/styles/colors";
import PropTypes from "prop-types";
import { getLabelFromEnumValue, getEnumName } from "../../enums";
import FlatButton from "material-ui/FlatButton";
import injectSheet from "react-jss";
import { connect } from "react-redux";
import { change, reset } from "redux-form";

/**
 * Bouton pour effacer tous les filtres
 */
const DeleteAllFilters = ({ classes, onClick }) => (
  <FlatButton
    primary={true}
    style={{ marginRight: "20px" }}
    label="Effacer les filtres"
    onClick={onClick}
  />
);

/**
 * Affiche tous les filtres actifs
 * @param {*} param0
 */
let SearchActiveFilters = class extends React.Component {
  static propTypes = {
    // {type:["autre","financement"],etape:["pre_operationnel"]}
    filters: PropTypes.object
  };
  filtersStringToExclude = [
    "typePerimetreInitialDeRecherche",
    "codePerimetreInitialDeRecherche",
    "statusPublication",
    "codePerimetreInitialDeRecherche",
    "dateEcheanceMonth",
    "dateEcheanceYear"
  ];
  // filtres supprimés quand on clique sur "effacer tout"
  filtersToReset = [
    "categorieParticuliere",
    "dateEcheance",
    "dateEcheanceMonth",
    "dateEcheanceYear",
    "categorieParticuliere",
    "destination",
    "formeDeDiffusion",
    "perimetreApplicationType",
    "thematiques",
    "type"
  ];
  /**
   * Désactivé le filtre cliqué
   * @param {string} fieldId
   * @param {string} filterValue
   */
  handleRequestDeleteCheckbox = (fieldId, filterValue) => {
    const currentFilters = this.props.filters;
    if (currentFilters[fieldId]) {
      let newFilterValue = currentFilters[fieldId].filter(value => {
        return value !== filterValue;
      });
      if (newFilterValue.length === 0) {
        newFilterValue = null;
      }
      this.props.change("searchFilters", fieldId, newFilterValue);
    }
  };
  handleRequestDelete = fieldId => {
    if (fieldId === "texte") {
      // effacer le perimetre et type initial de recherche si il existe
      // et qu'on est en train d'effacer le filtre "texte"
      // Sinon les résultats sont encore filtrées sur la base de ces filtres
      // alors que l'utilisateur aura bien effacé un filtre qui dit "Commune 44000" (par ex)
      if (this.props.filters.codePerimetreInitialDeRecherche) {
        delete this.props.filters.codePerimetreInitialDeRecherche;
      }
      if (this.props.filters.typePerimetreInitialDeRecherche) {
        delete this.props.filters.typePerimetreInitialDeRecherche;
      }
    }
    const currentFilters = this.props.filters;
    this.props.change("searchFilters", fieldId, null);
  };
  handleRequestDeleteDateEcheance = fieldId => {
    const currentFilters = this.props.filters;
    this.props.change("searchFilters", "dateEcheanceMonth", null);
    this.props.change("searchFilters", "dateEcheanceYear", null);
  };
  /**
   * Remettre à zéro tous les filtres activés par l'utilisateur
   */
  handleDeleteAllClick = () => {
    // on ne veut pas effacer le territoire actuel de recherche
    // donc on n'efface seulement les filtres indiqués dans notre liste blanche
    this.filtersToReset.map(filterId => {
      this.props.change("searchFilters", filterId, null);
    });
  };
  render() {
    const { classes, filters } = this.props;
    return (
      <div className={classes.root}>
        <DeleteAllFilters onClick={this.handleDeleteAllClick} />
        <span className={classes.chips}>
          {Object.keys(filters).map(filterId => {
            if (filterId === "dateEcheance") {
              return (
                <Chip
                  key={filterId}
                  style={{ margin: 4 }}
                  backgroundColor={blue300}
                  onRequestDelete={() =>
                    this.handleRequestDeleteDateEcheance(filterId)
                  }
                >
                  Date d'échéance : {filters[filterId].format("LLLL")}
                </Chip>
              );
            }
            // POUR LES FILTRES DE TYPE STRING
            if (
              typeof filters[filterId] === "string" &&
              !this.filtersStringToExclude.includes(filterId)
            ) {
              return (
                <Chip
                  key={filterId}
                  style={{ margin: 4 }}
                  backgroundColor={blue300}
                  onRequestDelete={() => this.handleRequestDelete(filterId)}
                >
                  {filters[filterId]}
                </Chip>
              );
            }
            // POUR LES FILTRES DE TYPE ARRAY
            if (filters[filterId].constructor === Array) {
              {
                return filters[filterId].map(filterValue => (
                  <Chip
                    key={filterId + "-" + filterValue}
                    style={{ margin: 4 }}
                    backgroundColor={blue300}
                    onRequestDelete={() =>
                      this.handleRequestDeleteCheckbox(filterId, filterValue)
                    }
                  >
                    <em>{getEnumName("aide", filterId)}</em> :{" "}
                    {getLabelFromEnumValue("aide", filterId, filterValue)}
                  </Chip>
                ));
              }
            }
          })}
        </span>
      </div>
    );
  }
};
SearchActiveFilters = injectSheet({
  root: {
    display: "flex"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  }
})(SearchActiveFilters);

function mapStateToProps(state) {
  if (state.form.searchFilters && state.form.searchFilters.values) {
    return {
      // les filtres sélectionnés par l'utilisateur pour sa recherche
      // ainsi que les données de périmètre qui ont été enregistré
      // par le moteur de recherche pas territoire
      filters: state.form.searchFilters.values
    };
  }
  // éviter une erreur pour cause de filters undefined
  return { filters: {} };
}

function mapDispatchToProps(dispatch) {
  return {
    change: (form, field, value) => {
      dispatch(change(form, field, value));
    },
    reset: () => dispatch(reset("searchFilters"))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchActiveFilters);