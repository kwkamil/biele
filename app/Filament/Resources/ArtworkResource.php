<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArtworkResource\Pages;
use App\Models\Artwork;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;

class ArtworkResource extends Resource
{
    protected static ?string $model = Artwork::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Dzieła sztuki';

    protected static ?string $modelLabel = 'dzieło';

    protected static ?string $pluralModelLabel = 'dzieła sztuki';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Podstawowe informacje')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Tytuł')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\Select::make('artist_id')
                            ->label('Artysta')
                            ->relationship('artist', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('gallery_id')
                            ->label('Galeria')
                            ->relationship('gallery', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Kategorizacja')
                    ->schema([
                        Forms\Components\TextInput::make('category')
                            ->label('Kategoria'),
                        Forms\Components\TextInput::make('style')
                            ->label('Styl'),
                        Forms\Components\TextInput::make('theme')
                            ->label('Temat'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Szczegóły techniczne')
                    ->schema([
                        Forms\Components\TextInput::make('medium')
                            ->label('Technika'),
                        Forms\Components\TextInput::make('dimensions')
                            ->label('Wymiary'),
                        Forms\Components\TextInput::make('price_min')
                            ->label('Cena minimalna')
                            ->numeric()
                            ->prefix('zł'),
                        Forms\Components\TextInput::make('price_max')
                            ->label('Cena maksymalna')
                            ->numeric()
                            ->prefix('zł'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Opis')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->label('Opis')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Zdjęcia')
                    ->schema([
                        Forms\Components\FileUpload::make('featured_image')
                            ->label('Zdjęcie główne')
                            ->image()
                            ->disk('public')
                            ->directory('artworks')
                            ->visibility('public'),
                        Forms\Components\FileUpload::make('additional_images')
                            ->label('Dodatkowe zdjęcia')
                            ->image()
                            ->multiple()
                            ->disk('public')
                            ->directory('artworks')
                            ->visibility('public')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_approved')
                            ->label('Zatwierdzone'),
                        Forms\Components\DateTimePicker::make('approved_at')
                            ->label('Data zatwierdzenia'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->label('Zdjęcie')
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder.png')),
                Tables\Columns\TextColumn::make('title')
                    ->label('Tytuł')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('artist.name')
                    ->label('Artysta')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('gallery.name')
                    ->label('Galeria')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategoria')
                    ->searchable()
                    ->badge(),
                Tables\Columns\TextColumn::make('price_min')
                    ->label('Cena od')
                    ->money('PLN')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_approved')
                    ->label('Zatwierdzone')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Utworzono')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Zaktualizowano')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('artist')
                    ->label('Artysta')
                    ->relationship('artist', 'name'),
                Tables\Filters\SelectFilter::make('gallery')
                    ->label('Galeria')
                    ->relationship('gallery', 'name'),
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategoria')
                    ->options([
                        'Malarstwo' => 'Malarstwo',
                        'Rzeźba' => 'Rzeźba',
                        'Grafika' => 'Grafika',
                        'Fotografia' => 'Fotografia',
                        'Instalacja' => 'Instalacja',
                    ]),
                Tables\Filters\TernaryFilter::make('is_approved')
                    ->label('Status zatwierdzenia')
                    ->boolean()
                    ->trueLabel('Zatwierdzone')
                    ->falseLabel('Oczekujące')
                    ->native(false),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Zatwierdź')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Artwork $record) => ! $record->is_approved)
                    ->requiresConfirmation()
                    ->action(function (Artwork $record) {
                        $record->update([
                            'is_approved' => true,
                            'approved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Dzieło zostało zatwierdzone')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve')
                        ->label('Zatwierdź wybrane')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each(function (Artwork $record) {
                                $record->update([
                                    'is_approved' => true,
                                    'approved_at' => now(),
                                ]);
                            });

                            Notification::make()
                                ->title('Dzieła zostały zatwierdzone')
                                ->success()
                                ->send();
                        }),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArtworks::route('/'),
            'create' => Pages\CreateArtwork::route('/create'),
            'edit' => Pages\EditArtwork::route('/{record}/edit'),
        ];
    }
}
