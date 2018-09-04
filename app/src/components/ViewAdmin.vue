<template>
    <div>
        <md-card>
            <md-card-header>
                <md-tabs md-alignment="centered">
                    <md-tab id="tab-home" md-icon="home" to="/manage"></md-tab>
                    <md-tab id="tab-pages" md-icon="group" to="/manage/users"></md-tab>
                </md-tabs>
            </md-card-header>
            <md-card-content>
                <router-view></router-view>
            </md-card-content>
        </md-card>
    </div>
</template>
