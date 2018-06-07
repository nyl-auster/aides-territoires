import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "../components/ui/Header";

storiesOf("Header", module).add("Header", () => (
  <Header
    title="Un outil pour les collectivités"
    subtitle="Identifiez en quelques clics toutes les aides disponibles sur votre territoire pour vos projets d'aménagement durab"
    callToActionText="Lancer la recherche"
  />
));
